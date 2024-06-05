import { Building } from '@/core/Building';
import { ElevatorSystem } from '@/core/ElevatorSystem';
import { ElevatorConfig } from '@/core/elevatorUtils';

export const FPS = 60;

const MULTIPLIERS = [1, 2, 5, 10, 20];

export function getNextMultiplier(currentMultiplier: number) {
  const index = MULTIPLIERS.indexOf(currentMultiplier);
  return MULTIPLIERS[(index + 1) % MULTIPLIERS.length];
}

const COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-teal-500',
  'bg-sky-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
];

export function getElevatorColor(elevatorId: string) {
  const index = elevatorId.charCodeAt(0) - 65;
  return COLORS[index % COLORS.length];
}

let ID_COUNTER = 0;

export function resetElevatorIdCounter() {
  ID_COUNTER = 0;
}

export function getNextElevatorId() {
  return String.fromCharCode(65 + ID_COUNTER++);
}

export function getDefaultSystem() {
  resetElevatorIdCounter();

  const building = new Building(-1, new Array(11).fill(3));
  const system = new ElevatorSystem(building);

  const elevators: ElevatorConfig[] = [
    {
      id: getNextElevatorId(),
      baseFloor: 0,
    },
    {
      id: getNextElevatorId(),
      baseFloor: 0,
    },
    {
      id: getNextElevatorId(),
      baseFloor: 0,
    },
  ];
  elevators.forEach((elevator) => {
    system.addElevator(elevator);
  });

  const routes = [
    [0, 3],
    [3, 6],
    [6, 9],
    [9, 0],
    [0, 9],
    [3, 4],
    [4, 5],
    [5, 6],
    [9, -1],
  ];
  routes.forEach((route) => {
    system.requestRoute(route[0], route[1]);
  });

  return system;
}
