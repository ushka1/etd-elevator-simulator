import * as yup from 'yup';
import { Building } from './Building';
import { ElevatorInfo } from './Elevator';
import { getFloorElevation } from './buildingUtils';

const metersPerSecond = 0.5;
const metersPerMilisecond = metersPerSecond / 1000;

const SPEED = metersPerMilisecond;
const DOORS_OPENING_TIME = 2000;
const PASSENGER_BOARDING_TIME = 6000;
const DOORS_CLOSING_TIME = 2000;

export type ElevatorConfig = {
  id: string;

  speed?: number;
  baseFloor?: number;

  doorsOpeningTime?: number;
  passengerBoardingTime?: number;
  doorsClosingTime?: number;
};

const elevatorConfigSchema = (
  building: Building,
): yup.ObjectSchema<Required<ElevatorConfig>> =>
  yup.object({
    id: yup.string().required(),
    speed: yup
      .number()
      .moreThan(0, 'Elevator speed must be greater than 0')
      .default(SPEED),
    baseFloor: yup
      .number()
      .min(
        building.minFloor,
        `Elevator base floor must be between ${building.minFloor} and ${building.maxFloor}`,
      )
      .max(
        building.maxFloor,
        `Elevator base floor must be between ${building.minFloor} and ${building.maxFloor}`,
      )
      .default(building.minFloor),
    doorsOpeningTime: yup
      .number()
      .moreThan(0, 'Elevator doors opening time must be greater than 0')
      .default(DOORS_OPENING_TIME),
    passengerBoardingTime: yup
      .number()
      .moreThan(0, 'Elevator passenger boarding time must be greater than 0')
      .default(PASSENGER_BOARDING_TIME),
    doorsClosingTime: yup
      .number()
      .moreThan(0, 'Elevator doors closing time must be greater than 0')
      .default(DOORS_CLOSING_TIME),
  });

export function sanitizeElevatorConfig(
  building: Building,
  config: ElevatorConfig,
): Required<ElevatorConfig> {
  const schema = elevatorConfigSchema(building);
  try {
    const sanitizedConfig = schema.validateSync(config, {
      abortEarly: false,
      stripUnknown: true,
    });
    return sanitizedConfig;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      console.error('Elevator config validation errors:', error?.errors);
    }
    throw error;
  }
}

/**
 * @returns The direction the elevator should move to reach the target floor.
 */
export function determineElevatorMovingDirection(
  elevator: ElevatorInfo,
  finalFloor: number,
): number {
  const finalElevation = getFloorElevation(elevator.building, finalFloor);

  if (elevator.elevation < finalElevation) {
    return 1;
  } else if (elevator.elevation === finalElevation) {
    return 0;
  } else {
    return -1;
  }
}
