export class Building {
  public maxFloor: number;
  public maxElevation: number;

  public floorsNumbers: number[] = [];
  public numberToElevation: Record<number, number> = {};
  public elevationToNumber: Record<number, number> = {};

  constructor(public minFloor: number, public floorsHeights: number[]) {
    if (this.floorsHeights.length < 1) {
      throw new Error('At least one floor height must be provided.');
    }

    let floorNumber = minFloor;
    let totalElevation = 0;

    floorsHeights.forEach((floorHeight) => {
      this.floorsNumbers.push(floorNumber);
      this.numberToElevation[floorNumber] = totalElevation;
      this.elevationToNumber[totalElevation] = floorNumber;

      floorNumber++;
      totalElevation += floorHeight;
    });

    this.maxFloor = floorNumber - 1;
    this.maxElevation = totalElevation - floorsHeights[-1];
  }
}
