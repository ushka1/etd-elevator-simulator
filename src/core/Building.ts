export class Building {
  floorsHeights: number[];
  floorsNumbers: number[] = [];

  numberToElevation: Record<number, number> = {};
  elevationToNumber: Record<number, number> = {};

  constructor(minFloor: number, floorsHeights: number[]) {
    if (floorsHeights.length <= 0) {
      throw new Error('At least one floor height must be provided.');
    }

    this.floorsHeights = floorsHeights;

    let number = minFloor;
    let elevation = 0;

    floorsHeights.forEach((height) => {
      this.floorsNumbers.push(number);
      this.numberToElevation[number] = elevation;
      this.elevationToNumber[elevation] = number;

      number++;
      elevation += height;
    });
  }

  get minFloor() {
    return this.floorsNumbers[0];
  }

  get maxFloor() {
    return this.floorsNumbers[this.floorsNumbers.length - 1];
  }

  get maxElevation() {
    return this.numberToElevation[this.maxFloor];
  }
}
