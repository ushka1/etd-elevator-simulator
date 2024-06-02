import { Building } from './Building';
import { ElevatorMovingState, ElevatorState } from './ElevatorState';
import { sanitizeElevatorConfig } from './elevatorUtils';

export type ElevatorConfig = {
  id: string;
  speed?: number;
  baseFloor?: number;
};

export class Elevator {
  private _config: Required<ElevatorConfig>;
  private _building: Building;
  private _elevation: number;

  private _direction = 0;
  private _doorsOpened = false;
  private _passengerCount = 0;

  private _state?: ElevatorState;

  doorsOpeningDuration = 2000;
  passengerBoardingDuration = 10000;
  doorsClosingDuration = 2000;

  constructor(building: Building, config: ElevatorConfig) {
    this._config = sanitizeElevatorConfig(building, config);
    this._building = building;
    this._elevation = building.getElevationAtFloorNumber(this.baseFloor);

    this._state = new ElevatorMovingState(this, 4, {
      passengersEntering: 2,
    });
  }

  get id() {
    return this._config.id;
  }

  get speed() {
    return this._config.speed;
  }

  get baseFloor() {
    return this._config.baseFloor;
  }

  get building() {
    return this._building;
  }

  get elevation() {
    return this._elevation;
  }

  get direction() {
    return this._direction;
  }

  set direction(value: number) {
    this._direction = value;
  }

  get doorsOpened() {
    return this._doorsOpened;
  }

  set doorsOpened(value: boolean) {
    this._doorsOpened = value;
  }

  get passengerCount() {
    return this._passengerCount;
  }

  set passengerCount(value: number) {
    this._passengerCount = value;
  }

  get state() {
    return this._state?.stateType;
  }

  get stateTitle() {
    return this._state?.title;
  }

  get floor() {
    return this.building.getFloorNumberAtElevation(this.elevation);
  }

  get closestFloor() {
    return this.building.getClosestFloorNumberAtElevation(this.elevation);
  }

  move(distance: number) {
    this._elevation += this.direction * distance;
  }

  movePrecisionFix() {
    this._elevation = this.building.getElevationAtFloorNumber(
      this.closestFloor,
    );
  }

  addTime(time: number) {
    let excessTime = time;
    if (!this._state) {
      this._state = this.requestNextState();
    }

    while (this._state && excessTime > 0) {
      excessTime = this._state.addTime(time);

      if (this._state.isCompleted()) {
        if (this._state.nextState) {
          this._state = this._state.nextState;
          continue;
        }

        this._state = this.requestNextState();
      }
    }
  }

  requestNextState() {
    return undefined;
  }
}
