import { Elevator } from './Elevator';
import { ElevatorStateType } from './ElevatorState';
import {
  calculateDistanceBetweenFloors,
  calculateDistanceToFloor,
} from './buildingUtils';

export function calculateElevatorToFloorTime(
  elevator: Elevator,
  floor: number,
) {
  const distance = calculateDistanceToFloor(
    elevator.building,
    elevator.elevation,
    floor,
  );
  const speed = elevator.config.speed;
  const time = distance / speed;

  return time;
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

export function calculateFloorServiceTime(elevator: Elevator) {
  return (
    elevator.config.doorsOpeningTime +
    elevator.config.passengerBoardingTime +
    elevator.config.doorsClosingTime
  );
}

export function calculateAdditionalReboardingTime(elevator: Elevator) {
  const state = elevator.state;
  const stateType = state?.stateType;

  switch (stateType) {
    case ElevatorStateType.DoorsOpening:
      return 0;

    case ElevatorStateType.PassengerBoarding:
      return elevator.config.passengerBoardingTime - state!.getRemainingTime();

    case ElevatorStateType.DoorsClosing:
      return (
        elevator.config.doorsOpeningTime +
        elevator.config.passengerBoardingTime +
        elevator.config.doorsClosingTime
      );

    default:
      return 0;
  }
}
