export class Building {
  private _maxFloor: number;
  private _maxElevation: number;

  private _floorsNumbers: number[] = [];
  private _numberToElevation: Record<number, number> = {};
  private _elevationToNumber: Record<number, number> = {};

  constructor(private _minFloor: number, private _floorsHeights: number[]) {
    if (this._floorsHeights.length < 1) {
      throw new Error('At least one floor height must be provided.');
    }

    let floorNumber = _minFloor;
    let totalElevation = 0;

    _floorsHeights.forEach((floorHeight) => {
      this._floorsNumbers.push(floorNumber);
      this._numberToElevation[floorNumber] = totalElevation;
      this._elevationToNumber[totalElevation] = floorNumber;

      floorNumber++;
      totalElevation += floorHeight;
    });

    this._maxFloor = floorNumber - 1;
    this._maxElevation = totalElevation - _floorsHeights[-1];
  }

  get minFloor() {
    return this._minFloor;
  }

  get maxFloor() {
    return this._maxFloor;
  }

  /**
   * @returns The floor number at passed (exact) `elevation` or `undefined` if `elevation` is invalid.
   */
  getFloorNumberAtElevation(elevation: number): number | undefined {
    return this._elevationToNumber[elevation];
  }

  /**
   * @returns The `floorNumber` that is closest to the passed `elevation`.
   */
  getClosestFloorNumberAtElevation(elevation: number): number {
    if (elevation < 0 || this._maxElevation < elevation) {
      throw new Error('Invalid elevation.');
    }

    let closestFloorNumber = Infinity;
    let closestFloorDistance = Infinity;

    this._floorsNumbers.forEach((floorNumber) => {
      const distance = this.calculateDistanceToFloor(elevation, floorNumber);
      if (distance < closestFloorDistance) {
        closestFloorNumber = floorNumber;
        closestFloorDistance = distance;
      }
    });

    return closestFloorNumber;
  }

  /**
   * @returns The elevation at passed `floor`.
   */
  getElevationAtFloorNumber(floor: number): number {
    const elevation = this._numberToElevation[floor];
    if (elevation === undefined) {
      throw new Error('Invalid floor number.');
    }

    return elevation;
  }

  /**
   * @returns The distance required to get from passed `elevation` to `floor`.
   */
  calculateDistanceToFloor(elevation: number, floor: number): number {
    if (elevation < 0 || this._maxElevation < elevation) {
      throw new Error('Invalid elevation.');
    }
    if (floor < this.minFloor || this.maxFloor < floor) {
      throw new Error('Invalid floor number.');
    }

    return Math.abs(elevation - this._numberToElevation[floor]);
  }

  /**
   * @returns The distance required to get from `initialFloor` to `finalFloor`.
   */
  calculateDistanceBetweenFloors(
    initialFloor: number,
    finalFloor: number,
  ): number {
    if (initialFloor < this.minFloor || this.maxFloor < initialFloor) {
      throw new Error('Invalid initialFloor number.');
    }
    if (finalFloor < this.minFloor || this.maxFloor < finalFloor) {
      throw new Error('Invalid finalFloor number.');
    }

    return Math.abs(
      this._numberToElevation[finalFloor] -
        this._numberToElevation[initialFloor],
    );
  }
}
