import { Building } from './Building';
import {
  DoorClosingState,
  DoorsOpeningState,
  ElevatorMovingState,
  ElevatorState,
  ElevatorStateType,
  PassengerBoardingState,
} from './ElevatorState';
import { RoutePlanner } from './RoutePlanner';
import {
  getClosestFloorNumber,
  getFloorElevation,
  getFloorNumber,
} from './buildingUtils';
import { ElevatorConfig, sanitizeElevatorConfig } from './elevatorUtils';

export class Elevator {
  config: Required<ElevatorConfig>;
  building: Building;
  routePlanner: RoutePlanner;

  direction = 0;
  elevation: number;
  doorsOpened = false;
  passengerCount = 0;

  state?: ElevatorState;

  constructor(building: Building, config: ElevatorConfig) {
    this.config = sanitizeElevatorConfig(building, config);
    this.building = building;
    this.routePlanner = new RoutePlanner(this);
    this.elevation = getFloorElevation(building, this.config.baseFloor);
  }

  get stateTitle() {
    return this.state?.title ?? 'Idle';
  }

  get floor() {
    return getFloorNumber(this.building, this.elevation);
  }

  move(distance: number) {
    this.elevation += this.direction * distance;
  }

  movePrecisionFix() {
    const closestFloor = getClosestFloorNumber(this.building, this.elevation);
    this.elevation = getFloorElevation(this.building, closestFloor);
  }

  addTime(time: number) {
    let excessTime = time;
    this.updateState();

    while (this.state && excessTime > 0) {
      excessTime = this.state.addTime(time);
      this.updateState();
    }

    return excessTime;
  }

  updateState() {
    if (!this.state) {
      // Idle state.
      const node = this.routePlanner.peekNode();
      if (!node) {
        return;
      }

      if (this.floor !== node.floor) {
        // Not at correct floor.
        this.state = new ElevatorMovingState(this, node.floor);
      } else {
        // At correct floor.
        this.state = new DoorsOpeningState(this, {
          entering: node.entering,
          exiting: node.exiting,
        });
        this.routePlanner.consumeNode();
      }

      return;
    }

    if (this.state.stateType === ElevatorStateType.ElevatorMoving) {
      const state = this.state as ElevatorMovingState;
      if (state.isCompleted()) {
        this.state = undefined;
        this.updateState();
        return;
      }

      const node = this.routePlanner.peekNode();
      if (!node) {
        return;
      }

      if (state.finalFloor !== node.floor) {
        // Destination floor changed, re-calculate moving state.
        this.state = new ElevatorMovingState(this, node.floor);
      }

      return;
    }

    if (this.state.stateType === ElevatorStateType.DoorsOpening) {
      const state = this.state as DoorsOpeningState;
      if (state.isCompleted()) {
        this.state = new PassengerBoardingState(this, {
          entering: state.entering,
          exiting: state.exiting,
        });
      }

      return;
    }

    if (this.state.stateType === ElevatorStateType.PassengerBoarding) {
      if (this.state.isCompleted()) {
        this.state = new DoorClosingState(this);
        return;
      }

      while (
        this.routePlanner.peekNode() &&
        this.routePlanner.peekNode()!.floor === this.floor
      ) {
        // Additional passengers are serviced.
        const node = this.routePlanner.consumeNode()!;

        const currentState = this.state as PassengerBoardingState;
        const updatedState = new PassengerBoardingState(this, {
          entering: currentState.entering + node.entering,
          exiting: currentState.exiting + node.exiting,
        });

        this.state = updatedState;
      }
    }

    if (this.state.stateType === ElevatorStateType.DoorsClosing) {
      if (this.state.isCompleted()) {
        this.state = undefined;
        this.updateState();
      }
    }
  }
}
