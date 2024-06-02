export class Building {
  private _maxFloor: number;
  private maxElevation: number;

  private floorsNumbers: number[] = [];
  private numberToElevation: Record<number, number> = {};
  private elevationToNumber: Record<number, number> = {};

  constructor(private _minFloor: number, private floorsHeights: number[]) {
    if (this.floorsHeights.length < 1) {
      throw new Error('At least one floor height must be provided.');
    }

    let floorNumber = _minFloor;
    let totalElevation = 0;

    floorsHeights.forEach((floorHeight) => {
      this.floorsNumbers.push(floorNumber);
      this.numberToElevation[floorNumber] = totalElevation;
      this.elevationToNumber[totalElevation] = floorNumber;

      floorNumber++;
      totalElevation += floorHeight;
    });

    this._maxFloor = floorNumber - 1;
    this.maxElevation = totalElevation - floorsHeights[-1];
  }

  get minFloor() {
    return this._minFloor;
  }

  get maxFloor() {
    return this._maxFloor;
  }

  /**
   * @returns The floor number at passed (exact) `elevation` or `undefined` if elevation is invalid.
   */
  getFloorNumberAtElevation(elevation: number): number | undefined {
    return this.elevationToNumber[elevation];
  }

  /**
   * @returns The elevation at passed `floorNumber`.
   */
  getElevationAtFloorNumber(floor: number): number {
    const elevation = this.numberToElevation[floor];
    if (elevation === undefined) {
      throw new Error('Invalid floor number.');
    }

    return elevation;
  }

  /**
   * @returns The distance required to get from passed `elevation` to `floor`.
   */
  calculateDistanceToFloor(elevation: number, floor: number): number {
    if (elevation < 0 || this.maxElevation < elevation) {
      throw new Error('Invalid elevation.');
    }
    if (floor < this.minFloor || this.maxFloor < floor) {
      throw new Error('Invalid floor number.');
    }

    return Math.abs(elevation - this.numberToElevation[floor]);
  }

  /**
   * @returns The distance required to get from `startFloor` to `endFloor`.
   */
  calculateDistanceBetweenFloors(startFloor: number, endFloor: number): number {
    if (startFloor < this.minFloor || this.maxFloor < startFloor) {
      throw new Error('Invalid startFloor number.');
    }
    if (endFloor < this.minFloor || this.maxFloor < endFloor) {
      throw new Error('Invalid endFloor number.');
    }

    return Math.abs(
      this.numberToElevation[endFloor] - this.numberToElevation[startFloor],
    );
  }
}
