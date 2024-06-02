import { Elevator } from './Elevator';
import {
  calculateElevatorMovingDistance,
  calculateElevatorMovingDuration,
  determineElevatorMovingDirection,
} from './elevatorUtils';

enum ElevatorStateType {
  ElevatorMoving,
  DoorsOpening,
  PassengerBoarding,
  DoorsClosing,
}

abstract class ElevatorState {
  title?: string;
  nextState?: ElevatorState;
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

type ElevatorStateOptions = {
  passengersEntering?: number;
  passengersExiting?: number;
};

export class ElevatorMovingState extends ElevatorState {
  direction: number;
  targetFloor: number;

  constructor(
    elevator: Elevator,
    targetFloor: number,
    options?: ElevatorStateOptions,
  ) {
    super(
      elevator,
      ElevatorStateType.ElevatorMoving,
      calculateElevatorMovingDuration(elevator, targetFloor),
    );

    this.title = `Moving to floor ${targetFloor}`;
    this.direction = determineElevatorMovingDirection(elevator, targetFloor);
    this.targetFloor = targetFloor;
    this.nextState = new DoorsOpeningState(elevator, options);
  }

  protected override onStartAction(): void {
    this.elevator.direction = this.direction;
  }

  protected override onUpdateAction(time: number): void {
    const distance = calculateElevatorMovingDistance(this.elevator, time);
    this.elevator.elevation += this.direction * distance;
  }

  protected override onCompleteAction(): void {
    this.elevator.direction = 0;
    this.elevator.elevation = this.elevator.building.getElevationAtFloorNumber(
      this.targetFloor,
    );
  }
}

export class DoorsOpeningState extends ElevatorState {
  constructor(elevator: Elevator, options?: ElevatorStateOptions) {
    super(
      elevator,
      ElevatorStateType.DoorsOpening,
      elevator.doorsOpeningDuration,
    );

    this.title = 'Opening doors';
    this.nextState = new PassengerBoardingState(this.elevator, options);
  }

  protected override onCompleteAction(): void {
    this.elevator.doorsOpened = true;
  }
}

export class PassengerBoardingState extends ElevatorState {
  passengersEntering: number;
  passengersExiting: number;

  constructor(elevator: Elevator, options?: ElevatorStateOptions) {
    super(
      elevator,
      ElevatorStateType.PassengerBoarding,
      elevator.passengerBoardingDuration,
    );

    this.title = 'Boarding passengers';
    this.passengersEntering = options?.passengersEntering ?? 0;
    this.passengersExiting = options?.passengersExiting ?? 0;
    this.nextState = new DoorClosingState(this.elevator);
  }

  protected override onCompleteAction(): void {
    this.elevator.passengerCount +=
      this.passengersEntering - this.passengersExiting;
  }
}

export class DoorClosingState extends ElevatorState {
  constructor(elevator: Elevator, _?: ElevatorStateOptions) {
    super(
      elevator,
      ElevatorStateType.DoorsClosing,
      elevator.doorsClosingDuration,
    );
    this.title = 'Closing doors';
  }

  protected override onCompleteAction(): void {
    this.elevator.doorsOpened = false;
  }
}
