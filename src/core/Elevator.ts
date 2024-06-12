import { Building } from './Building';
import {
  DoorClosingState,
  DoorsOpeningState,
  ElevatorMovingState,
  ElevatorState,
  ElevatorStateType,
  IdleState,
  PassengerBoardingState,
} from './ElevatorState';
import { RouteNode, RoutePlanner } from './RoutePlanner';
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

  state: ElevatorState = new IdleState(this);
  processedNode?: RouteNode;

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

    let prevState = this.state;
    while (excessTime > 0) {
      const nextState = this.determineState();
      if (
        prevState.stateType === ElevatorStateType.Idle &&
        nextState.stateType === ElevatorStateType.Idle
      ) {
        break;
      }

      this.state = nextState;
      prevState = nextState;

      excessTime = this.state.addTime(time);
    }

    this.state = this.determineState();
    return excessTime;
  }

  private determineState(): ElevatorState {
    const stateType = this.state.stateType;
    const routePlanner = this.routePlanner;

    if (stateType === ElevatorStateType.Idle) {
      const node = routePlanner.peekNode();
      if (!node) {
        // No more nodes to service, stay idle.
        return this.state;
      }

      if (this.floor !== node.floor) {
        // Elevator is not at destination floor, start moving.
        return new ElevatorMovingState(this, node.floor);
      } else {
        // Arrived at destination floor, open doors.
        routePlanner.consumeNode();
        return new DoorsOpeningState(this, node);
      }
    }

    if (stateType === ElevatorStateType.ElevatorMoving) {
      if (this.state.isCompleted()) {
        // Arrived at destination floor, change to idle.
        return new IdleState(this);
      }

      const node = routePlanner.peekNode();
      const state = this.state as ElevatorMovingState;
      if (node && node.floor !== state.finalFloor) {
        // Destination floor changed, change destination.
        return new ElevatorMovingState(this, node.floor);
      }

      // Destination floor unchanged, keep moving.
      return this.state;
    }

    if (stateType === ElevatorStateType.DoorsOpening) {
      const state = this.state as DoorsOpeningState;
      if (state.isCompleted()) {
        // Doors opened, start boarding passengers.
        return new PassengerBoardingState(this);
      }

      // Still opening doors.
      return this.state;
    }

    if (stateType === ElevatorStateType.PassengerBoarding) {
      if (this.state.isCompleted()) {
        // Boarding completed, close doors.
        return new DoorClosingState(this);
      }

      const node = routePlanner.peekNode();
      let additionalEntering = 0;
      let additionalExiting = 0;
      if (node && node.floor === this.floor) {
        // Check for additional passengers on the same floor.
        routePlanner.consumeNode();
        additionalEntering += node.entering ?? 0;
        additionalExiting += node.exiting ?? 0;
      }

      if (additionalEntering || additionalExiting) {
        // Additional passengers found, update state.
        const processedNode = this.processedNode!;
        const updatedNode = new RouteNode(
          processedNode.floor,
          processedNode.entering + additionalEntering,
          processedNode.exiting + additionalExiting,
        );
        return new PassengerBoardingState(this, updatedNode);
      }

      // Still boarding passengers.
      return this.state;
    }

    if (stateType === ElevatorStateType.DoorsClosing) {
      if (this.state.isCompleted()) {
        // Doors closed, change to idle.
        return new IdleState(this);
      }

      // Still closing doors.
      return this.state;
    }

    throw new Error('Unknown elevator state');
  }
}
