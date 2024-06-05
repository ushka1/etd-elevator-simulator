import EventEmitter from 'events';
import { Building } from './Building';
import { Elevator } from './Elevator';
import { RouteNode } from './RoutePlanner';
import { ElevatorConfig } from './elevatorUtils';

type ElevatorSystemEventMap = { update: [] };

export class ElevatorSystem {
  elevators: Elevator[] = [];
  building: Building;
  private emitter = new EventEmitter<ElevatorSystemEventMap>();

  constructor(building: Building) {
    this.building = building;
  }

  addElevator(config: ElevatorConfig) {
    this.elevators.push(new Elevator(this.building, config));
    this.emitter.emit('update');
  }

  removeElevator(id: string) {
    this.elevators = this.elevators.filter(
      (elevator) => elevator.config.id !== id,
    );
    this.emitter.emit('update');
  }

  addTime(time: number) {
    this.elevators.forEach((elevator) => elevator.addTime(time));
    this.emitter.emit('update');
  }

  requestRoute(initialFloor: number, finalFloor: number) {
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
    this.emitter.emit('update');
  }

  on(event: keyof ElevatorSystemEventMap, listener: () => void) {
    this.emitter.on(event, listener);
  }

  off(event: keyof ElevatorSystemEventMap, listener: () => void) {
    this.emitter.off(event, listener);
  }
}
