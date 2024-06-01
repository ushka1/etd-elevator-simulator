import { Building } from './Building';
import { getValidConfig } from './elevatorUtils';

export type ElevatorConfig = {
  id: string;
  speed?: number;
  baseFloor?: number;
};

export class Elevator {
  private building: Building;
  private config: Required<ElevatorConfig>;
  private elevation: number;

  constructor(building: Building, config: ElevatorConfig) {
    this.building = building;
    this.config = getValidConfig(building, config);
    this.elevation = building.getElevationAtFloorNumber(this.config.baseFloor)!;
  }
}
