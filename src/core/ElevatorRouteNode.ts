export type ElevatorRouteNodeConfig = {
  floor: number;
  passengersEntering?: number;
  passengersExiting?: number;
  next?: ElevatorRouteNode;
};

export class ElevatorRouteNode {
  floor: number;
  passengersEntering: number;
  passengersExiting: number;
  next?: ElevatorRouteNode;

  constructor(config: ElevatorRouteNodeConfig) {
    const {
      floor,
      passengersEntering = 0,
      passengersExiting = 0,
      next,
    } = config;

    this.floor = floor;
    this.passengersEntering = passengersEntering;
    this.passengersExiting = passengersExiting;
    this.next = next;
  }
}
