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

  doorsOpeningTime = 2500;
  passengerBoardingTime = 5000;
  doorsClosingTime = 2500;

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

  i = 10000; // preventing eventual overflow
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
    const node = this.routePlanner.requestNode();
    if (!node) {
      if (this.state?.isCompleted()) {
        this.state = undefined;
      }

      return;
    }

    if (!this.state) {
      // Idle state.
      if (this.floor !== node.floor) {
        // Not at correct floor.
        this.state = new ElevatorMovingState(this, node.floor);
      } else {
        // At correct floor.
        this.state = new DoorsOpeningState(this);
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

      if (state.finalFloor !== node.floor) {
        // Destination floor changed, re-calculate moving state.
        this.state = new ElevatorMovingState(this, node.floor);
      }

      return;
    }

    if (this.state.stateType === ElevatorStateType.DoorsOpening) {
      if (this.state.isCompleted()) {
        this.state = new PassengerBoardingState(this, {
          passengersEntering: node.entering,
          passengersExiting: node.exiting,
        });
      }

      return;
    }

    if (this.state.stateType === ElevatorStateType.PassengerBoarding) {
      const state = this.state as PassengerBoardingState;

      if (state.isCompleted()) {
        node.servePassengers(
          state.passengersEntering + state.passengersExiting,
        );

        this.state = new DoorClosingState(this);
        return;
      }

      if (
        state.passengersEntering !== node.entering ||
        state.passengersExiting !== node.exiting
      ) {
        // Passenger count changed, re-calculate boarding state.
        this.state = new PassengerBoardingState(this, {
          passengersEntering: node.entering,
          passengersExiting: node.exiting,
        });
      }
      return;
    }

    if (this.state.stateType === ElevatorStateType.DoorsClosing) {
      if (this.state.isCompleted()) {
        this.state = undefined;
        this.checkState();
      }

      return;
    }
  }
}
