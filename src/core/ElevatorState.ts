import { Elevator } from './Elevator';
import {
  calculateElevatorMovingDistance,
  calculateElevatorMovingTime,
  determineElevatorMovingDirection,
} from './elevatorUtils';

export enum ElevatorStateType {
  ElevatorMoving = 'ELEVATOR_MOVING',
  DoorsOpening = 'DOORS_OPENING',
  PassengerBoarding = 'PASSENGER_BOARDING',
  DoorsClosing = 'DOORS_CLOSING',
}

export abstract class ElevatorState {
  title?: string;
  private elapsedTime = 0;

  constructor(
    public elevator: Elevator,
    public stateType: ElevatorStateType,
    public duration: number,
  ) {}

  protected onStartAction?(): void;
  protected onUpdateAction?(time: number): void;
  protected onCompleteAction?(): void;

  addTime(time: number): number {
    if (this.isCompleted()) {
      return time;
    }

    if (this.isStarting()) {
      this.onStartAction?.();
    }

    const excessTime = this.getExcessTime(time);
    const validTime = time - excessTime;

    this.elapsedTime += validTime;
    this.onUpdateAction?.(validTime);

    if (this.isCompleted()) {
      this.onCompleteAction?.();
    }

    return excessTime;
  }

  getRemainingTime(): number {
    return this.duration - this.elapsedTime;
  }

  getExcessTime(time: number): number {
    return Math.max(0, time - this.getRemainingTime());
  }

  isStarting() {
    return this.elapsedTime === 0;
  }

  isCompleted() {
    return this.getRemainingTime() === 0;
  }
}

export class ElevatorMovingState extends ElevatorState {
  direction: number;
  finalFloor: number;

  constructor(elevator: Elevator, finalFloor: number) {
    super(
      elevator,
      ElevatorStateType.ElevatorMoving,
      calculateElevatorMovingTime(elevator, finalFloor),
    );

    this.title = `Moving to floor ${finalFloor}`;
    this.direction = determineElevatorMovingDirection(elevator, finalFloor);
    this.finalFloor = finalFloor;
  }

  protected override onStartAction(): void {
    this.elevator.direction = this.direction;
  }

  protected override onUpdateAction(time: number): void {
    const distance = calculateElevatorMovingDistance(this.elevator, time);
    this.elevator.move(distance);
  }

  protected override onCompleteAction(): void {
    this.elevator.direction = 0;
    this.elevator.movePrecisionFix();
  }
}

export class DoorsOpeningState extends ElevatorState {
  constructor(elevator: Elevator) {
    super(elevator, ElevatorStateType.DoorsOpening, elevator.doorsOpeningTime);

    this.title = 'Opening doors';
  }

  protected override onCompleteAction(): void {
    this.elevator.doorsOpened = true;
  }
}

type PassengerBoardingStateOptions = {
  passengersEntering?: number;
  passengersExiting?: number;
};

export class PassengerBoardingState extends ElevatorState {
  passengersEntering: number;
  passengersExiting: number;

  constructor(elevator: Elevator, options?: PassengerBoardingStateOptions) {
    super(
      elevator,
      ElevatorStateType.PassengerBoarding,
      elevator.passengerBoardingTime,
    );

    this.title = 'Boarding passengers';
    this.passengersEntering = options?.passengersEntering ?? 0;
    this.passengersExiting = options?.passengersExiting ?? 0;
  }

  protected override onCompleteAction(): void {
    this.elevator.passengerCount +=
      this.passengersEntering - this.passengersExiting;
  }
}

export class DoorClosingState extends ElevatorState {
  constructor(elevator: Elevator) {
    super(elevator, ElevatorStateType.DoorsClosing, elevator.doorsClosingTime);
    this.title = 'Closing doors';
  }

  protected override onCompleteAction(): void {
    this.elevator.doorsOpened = false;
  }
}
