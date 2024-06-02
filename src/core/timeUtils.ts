import { Elevator } from './Elevator';
import { ElevatorCommand, ElevatorCommandType } from './ElevatorCommand';

export function calculateMoveTimeBetweenFloors(
  elevator: Elevator,
  initialFloor: number,
  finalFloor: number,
) {
  const initialElevation =
    elevator.building.getElevationAtFloorNumber(initialFloor);
  const finalElevation =
    elevator.building.getElevationAtFloorNumber(finalFloor);
  const distance = Math.abs(finalElevation - initialElevation);
  const speed = elevator.speed;

  const time = distance / speed;
  return time;
}

export function calculateTimeToFloor(elevator: Elevator, finalFloor: number) {
  const initialElevation = elevator.elevation;
  const finalElevation =
    elevator.building.getElevationAtFloorNumber(finalFloor);

  const distance = Math.abs(finalElevation - initialElevation);
  const speed = elevator.speed;
  const time = distance / speed;

  return time;
}

export function calculateTotalServiceTime(elevator: Elevator) {
  return (
    elevator.doorsOpeningDuration +
    elevator.passengerBoardingDuration +
    elevator.doorsClosingDuration
  );
}

export function calculateTimeToBoard(
  elevator: Elevator,
  finalFloor: number,
  command?: ElevatorCommand,
) {
  let time = calculateTimeToFloor(elevator, finalFloor);

  if (!command) {
    time += calculateTotalServiceTime(elevator);
  }

  if (command?.commandType === ElevatorCommandType.ElevatorMoving) {
    time += calculateTotalServiceTime(elevator);
  }

  if (command?.commandType === ElevatorCommandType.DoorsOpening) {
    time +=
      command.getRemainingTime() +
      elevator.passengerBoardingDuration +
      elevator.doorsClosingDuration;
  }

  if (command?.commandType === ElevatorCommandType.PassengerBoarding) {
    // reset boarding time
    time += elevator.passengerBoardingDuration + elevator.doorsClosingDuration;
  }

  if (command?.commandType === ElevatorCommandType.DoorsClosing) {
    time += command.getRemainingTime() + calculateTotalServiceTime(elevator);
  }

  return time;
}
