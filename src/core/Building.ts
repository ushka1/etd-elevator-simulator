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

  private round(value: number): number {
    const precision = 3;
    const multer = 10 ** precision;

    return Math.round(value * multer) / multer;
  }

  /**
   * @returns The floor number at passed (exact) `elevation` or `undefined` if elevation is invalid.
   */
  getFloorNumberAtElevation(elevation: number): number | undefined {
    return this.elevationToNumber[elevation];
  }

  /**
   * @returns The elevation at passed `floorNumber` or `undefined` if floor number is invalid.
   */
  getElevationAtFloorNumber(floor: number): number | undefined {
    return this.numberToElevation[floor];
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

    let distance = Math.abs(elevation - this.numberToElevation[floor]);
    return this.round(distance);
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

    let distance = Math.abs(
      this.numberToElevation[endFloor] - this.numberToElevation[startFloor],
    );
    return this.round(distance);
  }
}
