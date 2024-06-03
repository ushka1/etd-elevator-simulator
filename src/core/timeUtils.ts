import { Elevator } from './Elevator';
import {
  calculateDistanceBetweenFloors,
  calculateDistanceToFloor,
} from './buildingUtils';

export function calculateElevatorToFloorTime(
  elevator: Elevator,
  floor: number,
) {
  let time = 0;

  if (elevator.floor !== floor) {
    const distance = calculateDistanceToFloor(
      elevator.building,
      elevator.elevation,
      floor,
    );
    const speed = elevator.config.speed;
    time = distance / speed;
  }

  return time;
}

export function calculateFloorServiceTime(elevator: Elevator) {
  return (
    elevator.doorsOpeningTime +
    elevator.passengerBoardingTime +
    elevator.doorsClosingTime
  );
}

export function calculateFloorToFloorTime(
  elevator: Elevator,
  initialFloor: number,
  finalFloor: number,
) {
  const distance = calculateDistanceBetweenFloors(
    elevator.building,
    initialFloor,
    finalFloor,
  );
  const speed = elevator.config.speed;
  return distance / speed;
}
