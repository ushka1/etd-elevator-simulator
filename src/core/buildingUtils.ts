import { Building } from './Building';

/**
 * @returns The floor number of passed `elevation`.
 */
export function getFloorNumber(
  building: Building,
  elevation: number,
): number | undefined {
  return building.elevationToNumber[elevation];
}

/**
 * @returns The floor number of the closest floor to passed `elevation`.
 */
export function getClosestFloorNumber(
  building: Building,
  elevation: number,
): number {
  let closestFloorNumber = building.floorsNumbers[0];
  let closestFloorDistance = calculateDistanceToFloor(
    building,
    elevation,
    building.floorsNumbers[0],
  );

  building.floorsNumbers.forEach((floorNumber) => {
    const distance = calculateDistanceToFloor(building, elevation, floorNumber);
    if (distance < closestFloorDistance) {
      closestFloorNumber = floorNumber;
      closestFloorDistance = distance;
    }
  });

  return closestFloorNumber;
}

/**
 * @returns The elevation of passed `floor`.
 */
export function getFloorElevation(building: Building, floor: number): number {
  const elevation = building.numberToElevation[floor];
  if (elevation === undefined) {
    throw new Error('Invalid floor number.');
  }

  return elevation;
}

/**
 * @returns The distance required to get from `elevation` to `finalFloor`.
 */
export function calculateDistanceToFloor(
  building: Building,
  elevation: number,
  finalFloor: number,
): number {
  if (finalFloor < building.minFloor || building.maxFloor < finalFloor) {
    throw new Error('Invalid floor number.');
  }

  return Math.abs(elevation - building.numberToElevation[finalFloor]);
}

/**
 * @returns The distance required to get from `initialFloor` to `finalFloor`.
 */
export function calculateDistanceBetweenFloors(
  building: Building,
  initialFloor: number,
  finalFloor: number,
): number {
  if (initialFloor < building.minFloor || building.maxFloor < initialFloor) {
    throw new Error('Invalid initialFloor number.');
  }
  if (finalFloor < building.minFloor || building.maxFloor < finalFloor) {
    throw new Error('Invalid finalFloor number.');
  }

  return Math.abs(
    building.numberToElevation[finalFloor] -
      building.numberToElevation[initialFloor],
  );
}
