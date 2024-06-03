import { Building } from './Building';
import { Elevator, ElevatorConfig } from './Elevator';
import {
  calculateDistanceToFloor,
  getElevationAtFloorNumber,
} from './buildingUtils';

/**
 * Returns a validated and sanitized elevator configuration. For every non specified
 * or invalid value, a default value is used. In case of invalid values, a warning
 * is logged to the console.
 */
export function sanitizeElevatorConfig(
  building: Building,
  config: ElevatorConfig,
): Required<ElevatorConfig> {
  const id = config.id;

  const metersPerSecond = 1;
  const metersPerMilisecond = metersPerSecond / 1000;

  let speed = metersPerMilisecond;
  if (config.speed != undefined) {
    if (config.speed <= 0) {
      console.error(
        'Elevator speed must be greater than 0. Using default value (1).',
      );
    } else {
      speed = config.speed;
    }
  }

  let baseFloor = building.minFloor;
  if (config.baseFloor !== undefined) {
    if (
      config.baseFloor < building.minFloor ||
      building.maxFloor < config.baseFloor
    ) {
      console.error(
        `Elevator base floor must be between ${building.minFloor} and ${building.maxFloor}. Using default value (${building.minFloor}).`,
      );
    } else {
      baseFloor = config.baseFloor;
    }
  }

  return {
    id,
    speed,
    baseFloor,
  };
}

/**
 * Returns the direction in which the elevator must move to reach the target floor.
 */
export function determineElevatorMovingDirection(
  elevator: Elevator,
  targetFloor: number,
): number {
  const targetElevation = getElevationAtFloorNumber(
    elevator.building,
    targetFloor,
  );

  if (elevator.elevation < targetElevation) {
    return 1;
  } else if (elevator.elevation === targetElevation) {
    return 0;
  } else {
    return -1;
  }
}

/**
 * Returns the time it takes for the elevator to move to the target floor.
 */
export function calculateElevatorMovingTime(
  elevator: Elevator,
  targetFloor: number,
): number {
  const speed = elevator.config.speed;
  const distance = calculateDistanceToFloor(
    elevator.building,
    elevator.elevation,
    targetFloor,
  );

  const time = distance / speed;
  return time;
}

/**
 * Returns the distance the elevator moves in the given time.
 */
export function calculateElevatorMovingDistance(
  elevator: Elevator,
  time: number,
) {
  return time * elevator.config.speed;
}