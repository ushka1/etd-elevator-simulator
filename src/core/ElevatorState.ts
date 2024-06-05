import { Elevator } from './Elevator';
import { determineElevatorMovingDirection } from './elevatorUtils';
import { calculateElevatorToFloorTime } from './timeUtils';

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
    const normalizedTime = time - excessTime;

    this.elapsedTime += normalizedTime;
    this.onUpdateAction?.(normalizedTime);

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
      calculateElevatorToFloorTime(elevator, finalFloor),
    );

    this.title = `Moving to floor ${finalFloor}`;
    this.direction = determineElevatorMovingDirection(elevator, finalFloor);
    this.finalFloor = finalFloor;
  }

  protected override onStartAction(): void {
    this.elevator.direction = this.direction;
  }

  protected override onUpdateAction(time: number): void {
    const speed = this.elevator.config.speed;
    const distance = time * speed;
    this.elevator.move(distance);
  }

  protected override onCompleteAction(): void {
    this.elevator.direction = 0;
    this.elevator.movePrecisionFix();
  }
}

type DoorsOpeningStateOptions = {
  entering?: number;
  exiting?: number;
};

export class DoorsOpeningState extends ElevatorState {
  entering: number;
  exiting: number;

  constructor(elevator: Elevator, options: DoorsOpeningStateOptions) {
    super(
      elevator,
      ElevatorStateType.DoorsOpening,
      elevator.config.doorsOpeningTime,
    );

    this.title = 'Opening doors';
    this.entering = options?.entering ?? 0;
    this.exiting = options?.exiting ?? 0;
  }

  protected override onCompleteAction(): void {
    this.elevator.doorsOpened = true;
  }
}

type PassengerBoardingStateOptions = {
  entering?: number;
  exiting?: number;
};

export class PassengerBoardingState extends ElevatorState {
  entering: number;
  exiting: number;

  constructor(elevator: Elevator, options?: PassengerBoardingStateOptions) {
    super(
      elevator,
      ElevatorStateType.PassengerBoarding,
      elevator.config.passengerBoardingTime,
    );

    this.title = 'Boarding';
    this.entering = options?.entering ?? 0;
    this.exiting = options?.exiting ?? 0;
  }

  protected override onCompleteAction(): void {
    this.elevator.passengerCount += this.entering - this.exiting;
  }
}

export class DoorClosingState extends ElevatorState {
  constructor(elevator: Elevator) {
    super(
      elevator,
      ElevatorStateType.DoorsClosing,
      elevator.config.doorsClosingTime,
    );
    this.title = 'Closing doors';
  }

  protected override onCompleteAction(): void {
    this.elevator.doorsOpened = false;
  }
}
