import { Building } from './Building';
import { ElevatorConfig } from './Elevator';

/**
 * Validates and returns a valid elevator configuration. For every non specified
 * or invalid value, a default value is used. In case of invalid values, a warning
 * is logged to the console.
 */
export function getValidConfig(
  building: Building,
  config: ElevatorConfig,
): Required<ElevatorConfig> {
  const id = config.id;

  let speed = 1;
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
