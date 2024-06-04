import { Building } from './Building';
import { Elevator } from './Elevator';
import { RouteNode } from './RoutePlanner';
import { ElevatorConfig } from './elevatorUtils';

export class ElevatorSystem {
  private elevators: Elevator[] = [];
  private building: Building;

  constructor(building: Building) {
    this.building = building;
  }

  addElevator(config: ElevatorConfig) {
    this.elevators.push(new Elevator(this.building, config));
  }

  addTime(time: number) {
    this.elevators.forEach((elevator) => elevator.addTime(time));
  }

  addRoute(initialFloor: number, finalFloor: number) {
    let bestElevator: Elevator | undefined;
    let bestRoute: RouteNode[] | undefined;
    let bestCost = Infinity;

    this.elevators.forEach((elevator) => {
      const [route, cost] = elevator.routePlanner.findBestRoute(
        initialFloor,
        finalFloor,
      );

      if (cost < bestCost) {
        bestElevator = elevator;
        bestRoute = route;
        bestCost = cost;
      }
    });

    if (bestElevator && bestRoute) {
      bestElevator.routePlanner.updateRoute(bestRoute);
    }
  }

  getState() {
    return {
      elevators: this.elevators,
      building: this.building,
    };
  }
}
