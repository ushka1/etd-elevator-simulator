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
  getClosestFloorNumberAtElevation,
  getElevationAtFloorNumber,
  getFloorNumberAtElevation,
} from './buildingUtils';
import { sanitizeElevatorConfig } from './elevatorUtils';

export type ElevatorConfig = {
  id: string;
  speed?: number;
  baseFloor?: number;
};

export class Elevator {
  config: Required<ElevatorConfig>;
  building: Building;
  elevation: number;
  routePlanner: RoutePlanner;

  direction = 0;
  doorsOpened = false;
  passengerCount = 0;

  state?: ElevatorState;

  doorsOpeningTime = 2000;
  passengerBoardingTime = 8000;
  doorsClosingTime = 2000;

  constructor(building: Building, config: ElevatorConfig) {
    this.config = sanitizeElevatorConfig(building, config);
    this.building = building;
    this.elevation = getElevationAtFloorNumber(building, this.config.baseFloor);
    this.routePlanner = new RoutePlanner(this);
  }

  get stateTitle() {
    return this.state?.title;
  }

  get floor() {
    return getFloorNumberAtElevation(this.building, this.elevation);
  }

  move(distance: number) {
    this.elevation += this.direction * distance;
  }

  movePrecisionFix() {
    const closestFloor = getClosestFloorNumberAtElevation(
      this.building,
      this.elevation,
    );
    this.elevation = getElevationAtFloorNumber(this.building, closestFloor);
  }

  i = 10000;
  addTime(time: number) {
    let excessTime = time;
    this.checkState();

    while (this.state && excessTime > 0 && this.i > 0) {
      excessTime = this.state.addTime(time);
      this.checkState();
      this.i--;
    }

    return excessTime;
  }

  checkState() {
    if (!this.state) {
      // Idle state.
      const node = this.routePlanner.previewNode();
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

      if (this.state.isCompleted()) {
        this.state = undefined;
        this.checkState();
        return;
      }

      const node = this.routePlanner.previewNode();
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
      if (this.state.isCompleted()) {
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

      let node = this.routePlanner.previewNode();
      while (node && node.floor === this.floor) {
        // Additional passengers are entering or exiting.
        const currentState = this.state as PassengerBoardingState;
        const updatedState = new PassengerBoardingState(this, {
          entering: currentState.entering + node.entering,
          exiting: currentState.exiting + node.exiting,
        });
        this.state = updatedState;
        this.routePlanner.consumeNode();
        node = this.routePlanner.previewNode();
      }
    }

    if (this.state.stateType === ElevatorStateType.DoorsClosing) {
      if (this.state.isCompleted()) {
        this.state = undefined;
        this.checkState();
      }
    }
  }
}
