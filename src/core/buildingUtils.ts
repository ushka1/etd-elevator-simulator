import { Building } from './Building';

/**
 * @returns The floor number at passed (exact) `elevation` or `undefined` if elevation is invalid.
 */
export function getFloorNumberAtElevation(
  building: Building,
  elevation: number,
): number | undefined {
  return building.elevationToNumber[elevation];
}

/**
 * @returns The closest floor number to passed `elevation`.
 */
export function getClosestFloorNumberAtElevation(
  building: Building,
  elevation: number,
): number {
  if (elevation < 0 || building.maxElevation < elevation) {
    throw new Error('Invalid elevation.');
  }

  let closestFloorNumber = Infinity;
  let closestFloorDistance = Infinity;

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
 * @returns The elevation at passed `floorNumber`.
 */
export function getElevationAtFloorNumber(
  building: Building,
  floor: number,
): number {
  const elevation = building.numberToElevation[floor];
  if (elevation === undefined) {
    throw new Error('Invalid floor number.');
  }

  return elevation;
}

/**
 * @returns The distance required to get from passed `elevation` to `finalFloor`.
 */
export function calculateDistanceToFloor(
  building: Building,
  elevation: number,
  finalFloor: number,
): number {
  if (elevation < 0 || building.maxElevation < elevation) {
    throw new Error('Invalid elevation.');
  }
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
