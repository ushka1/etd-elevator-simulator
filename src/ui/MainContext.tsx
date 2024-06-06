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

const defaultSystem = getDefaultSystem();

interface MainContextProps {
  multiplier: number;
  playing: boolean;
  system: ElevatorSystem;
  update: boolean;
  addElevator: (baseFloor?: number) => void;
  addTime: (time: number) => void;
  changeBuilding: (minFloor: number, floorsHeights: number[]) => void;
  cycleMultiplier: () => void;
  forceUpdate: () => void;
  removeElevator: (elevatorId: string) => void;
  requestRoute: (initialFloor: number, finalFloor: number) => void;
  setMultiplier: (multiplier: number) => void;
  setPlaying: (playing: boolean) => void;
}

const MainContext = createContext<MainContextProps | undefined>(undefined);

export default function MainContextProvider({
  children,
}: Readonly<React.PropsWithChildren>) {
  const [system, setSystem] = useState(defaultSystem);
  const [playing, setPlaying] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [update, forceUpdate] = useReducer((x) => !x, false);

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

  const removeElevator = (elevatorId: string) => {
    system.removeElevator(elevatorId);
  };

  const requestRoute = (initialFloor: number, finalFloor: number) => {
    system.requestRoute(initialFloor, finalFloor);
  };

  const changeBuilding = (minFloor: number, floorsHeights: number[]) => {
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
  }, [multiplier, playing, system]);

  const contextValue = useMemo(() => {
    return {
      multiplier,
      playing,
      system,
      update,
      addElevator,
      addTime,
      changeBuilding,
      cycleMultiplier,
      forceUpdate,
      removeElevator,
      requestRoute,
      setMultiplier,
      setPlaying,
    };
  }, [multiplier, playing, system, update]);

  return (
    <MainContext.Provider value={contextValue}>{children}</MainContext.Provider>
  );
}

export const useMainContext = () => {
  return useContext(MainContext as React.Context<MainContextProps>);
};
