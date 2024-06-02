import EventEmitter from 'events';
import { Elevator } from './Elevator';
import {
  calculateElevatorMovingDistance,
  calculateElevatorMovingDuration,
  determineElevatorMovingDirection,
} from './elevatorUtils';

type ElevatorCommandEventMap = { start: []; update: []; complete: [] };

export enum ElevatorCommandType {
  Idle = 'IDLE',
  ElevatorMoving = 'ELEVATOR_MOVING',
  DoorsOpening = 'DOORS_OPENING',
  PassengerBoarding = 'PASSENGER_BOARDING',
  DoorsClosing = 'DOORS_CLOSING',
}

export abstract class ElevatorCommand {
  title?: string;
  private elapsedTime = 0;
  private emitter = new EventEmitter<ElevatorCommandEventMap>();

  constructor(
    public elevator: Elevator,
    public commandType: ElevatorCommandType,
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
      this.emitter.emit('complete');
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

  on(
    event: keyof ElevatorCommandEventMap,
    listener: (...args: ElevatorCommandEventMap[typeof event]) => void,
  ) {
    this.emitter.on(event, listener);
  }

  once(
    event: keyof ElevatorCommandEventMap,
    listener: (...args: ElevatorCommandEventMap[typeof event]) => void,
  ) {
    this.emitter.once(event, listener);
  }

  off(
    event: keyof ElevatorCommandEventMap,
    listener: (...args: ElevatorCommandEventMap[typeof event]) => void,
  ) {
    this.emitter.off(event, listener);
  }
}

export class ElevatorMovingCommand extends ElevatorCommand {
  direction: number;
  finalFloor: number;

  constructor(elevator: Elevator, finalFloor: number) {
    super(
      elevator,
      ElevatorCommandType.ElevatorMoving,
      calculateElevatorMovingDuration(elevator, finalFloor),
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

export class DoorsOpeningCommand extends ElevatorCommand {
  constructor(elevator: Elevator) {
    super(
      elevator,
      ElevatorCommandType.DoorsOpening,
      elevator.doorsOpeningDuration,
    );

    this.title = 'Opening doors';
  }

  protected override onCompleteAction(): void {
    this.elevator.doorsOpened = true;
  }
}

export class PassengerBoardingCommand extends ElevatorCommand {
  constructor(
    elevator: Elevator,
    public passengersEntering: number,
    public passengersExiting: number,
  ) {
    super(
      elevator,
      ElevatorCommandType.PassengerBoarding,
      elevator.passengerBoardingDuration,
    );

    this.title = 'Boarding passengers';
  }

  protected override onCompleteAction(): void {
    this.elevator.passengerCount +=
      this.passengersEntering - this.passengersExiting;
  }
}

export class DoorClosingCommand extends ElevatorCommand {
  constructor(elevator: Elevator) {
    super(
      elevator,
      ElevatorCommandType.DoorsClosing,
      elevator.doorsClosingDuration,
    );
    this.title = 'Closing doors';
  }

  protected override onCompleteAction(): void {
    this.elevator.doorsOpened = false;
  }
}
