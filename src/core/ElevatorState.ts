import { Elevator } from './Elevator';
import { RouteNode } from './RoutePlanner';
import { determineElevatorMovingDirection } from './elevatorUtils';
import { calculateElevatorToFloorTime } from './timeUtils';

export enum ElevatorStateType {
  Idle = 'IDLE',
  ElevatorMoving = 'ELEVATOR_MOVING',
  DoorsOpening = 'DOORS_OPENING',
  PassengerBoarding = 'PASSENGER_BOARDING',
  DoorsClosing = 'DOORS_CLOSING',
}

export interface ElevatorStateInfo {
  readonly title: string;
  readonly stateType: ElevatorStateType;
  readonly duration: number;
  readonly getRemainingTime: () => number;
  readonly isCompleted: () => boolean;
}

export abstract class ElevatorState implements ElevatorStateInfo {
  title: string = '';
  protected elapsedTime = 0;

  constructor(
    protected elevator: Elevator,
    public stateType: ElevatorStateType,
    public duration: number,
  ) {}

  protected onStartAction?(): void;
  protected onUpdateAction?(time: number): void;
  protected onCompleteAction?(): void;

  addTime(time: number): number {
    if (time <= 0 || this.isCompleted()) {
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

export class IdleState extends ElevatorState {
  constructor(elevator: Elevator) {
    super(elevator, ElevatorStateType.Idle, 0);
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

export class DoorsOpeningState extends ElevatorState {
  private consumedNode: RouteNode;

  constructor(elevator: Elevator, consumedNode: RouteNode) {
    super(
      elevator,
      ElevatorStateType.DoorsOpening,
      elevator.config.doorsOpeningTime,
    );

    this.title = 'Opening doors';
    this.consumedNode = consumedNode;
  }

  protected override onStartAction(): void {
    this.elevator.processedNode = this.consumedNode;
  }

  protected override onCompleteAction(): void {
    this.elevator.doorsOpened = true;
  }
}

export class PassengerBoardingState extends ElevatorState {
  private updatedNode?: RouteNode;

  constructor(elevator: Elevator, updatedNode?: RouteNode) {
    super(
      elevator,
      ElevatorStateType.PassengerBoarding,
      elevator.config.passengerBoardingTime,
    );

    this.title = 'Boarding';
    this.updatedNode = updatedNode;
  }

  protected override onStartAction(): void {
    if (this.updatedNode) {
      this.elevator.processedNode = this.updatedNode;
    }
  }

  protected override onCompleteAction(): void {
    const entering = this.elevator.processedNode?.entering ?? 0;
    const exiting = this.elevator.processedNode?.exiting ?? 0;

    this.elevator.passengerCount += entering - exiting;
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
    this.elevator.processedNode = undefined;
    this.elevator.doorsOpened = false;
  }
}
