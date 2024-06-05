import { Building } from '@/core/Building';
import { ElevatorSystem } from '@/core/ElevatorSystem';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import {
  FPS,
  getDefaultSystem,
  getNextElevatorId,
  getNextMultiplier,
  resetElevatorIdCounter,
} from './utils';

interface MainContextProps {
  system: ElevatorSystem;
  playing: boolean;
  multiplier: number;
  update: boolean;
  setPlaying: (playing: boolean) => void;
  setMultiplier: (multiplier: number) => void;
  requestRoute: (initialFloor: number, finalFloor: number) => void;
  changeFloors: (minFloor: number, floorsHeights: number[]) => void;
  addTime: (time: number) => void;
  cycleMultiplier: () => void;
  forceUpdate: () => void;
  addElevator: (baseFloor?: number) => void;
  removeElevator: (elevatorId: string) => void;
}

const MainContext = createContext<MainContextProps | undefined>(undefined);
const defaultSystem = getDefaultSystem();

export default function MainContextProvider({
  children,
}: Readonly<React.PropsWithChildren>) {
  const [system, setSystem] = useState(defaultSystem);
  const [playing, setPlaying] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [update, forceUpdate] = useReducer((x) => !x, false);

  const removeElevator = (elevatorId: string) => {
    system.removeElevator(elevatorId);
  };

  const addElevator = (baseFloor: number = 0) => {
    if (baseFloor > system.building.maxFloor) {
      baseFloor = system.building.minFloor;
    }
    if (baseFloor < system.building.minFloor) {
      baseFloor = system.building.minFloor;
    }

    system.addElevator({
      id: getNextElevatorId(),
      baseFloor,
    });
  };

  const requestRoute = (initialFloor: number, finalFloor: number) => {
    system.requestRoute(initialFloor, finalFloor);
  };

  const changeFloors = (minFloor: number, floorsHeights: number[]) => {
    const newBuilding = new Building(minFloor, floorsHeights);
    const newSystem = new ElevatorSystem(newBuilding);
    resetElevatorIdCounter();

    setPlaying(false);
    setSystem(newSystem);
  };

  const addTime = (time: number) => {
    if (!playing) {
      system.addTime(time);
    }
  };

  const cycleMultiplier = () => {
    const nextMultiplier = getNextMultiplier(multiplier);
    setMultiplier(nextMultiplier);
  };

  useEffect(() => {
    system.on('update', forceUpdate);

    return () => {
      system.off('update', forceUpdate);
    };
  }, [forceUpdate, system]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (playing) {
      const frameTime = 1000 / FPS;
      const systemTime = frameTime * multiplier;

      interval = setInterval(() => {
        system.addTime(systemTime);
      }, frameTime);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [playing, system, multiplier]);

  const contextValue = useMemo(() => {
    return {
      system,
      playing,
      multiplier,
      update,
      setPlaying,
      setMultiplier,
      requestRoute,
      changeFloors,
      addTime,
      cycleMultiplier,
      forceUpdate,
      addElevator,
      removeElevator,
    };
  }, [system, playing, multiplier, update]);

  return (
    <MainContext.Provider value={contextValue}>{children}</MainContext.Provider>
  );
}

export const useMainContext = () => {
  return useContext(MainContext as React.Context<MainContextProps>);
};
