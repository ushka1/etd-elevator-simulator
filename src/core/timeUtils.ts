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

export function calculateFinishBoardingTime(elevator: Elevator) {
  const state = elevator.state;
  const stateType = state?.stateType;

  switch (stateType) {
    case ElevatorStateType.DoorsOpening:
      return (
        state!.getRemainingTime() +
        elevator.config.passengerBoardingTime +
        elevator.config.doorsClosingTime
      );

    case ElevatorStateType.PassengerBoarding:
      return state!.getRemainingTime() + elevator.config.doorsClosingTime;

    case ElevatorStateType.DoorsClosing:
      return state!.getRemainingTime();

    default:
      return 0;
  }
}

export function calculateAdditionalBoardingTime(elevator: Elevator) {
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

export function calculateFloorToFloorWithServiceTime(
  elevator: Elevator,
  initialFloor: number,
  finalFloor: number,
) {
  let time = calculateFloorToFloorTime(elevator, initialFloor, finalFloor);
  if (initialFloor !== finalFloor) {
    time += calculateFloorServiceTime(elevator);
  }

  return time;
}

export function calculateElevatorToFloorWithServiceTime(
  elevator: Elevator,
  floor: number,
) {
  if (elevator.floor === floor) {
    return calculateAdditionalBoardingTime(elevator);
  } else {
    return (
      calculateFinishBoardingTime(elevator) +
      calculateElevatorToFloorTime(elevator, floor) +
      calculateFloorServiceTime(elevator)
    );
  }
}
