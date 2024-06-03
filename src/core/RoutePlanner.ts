import { Elevator } from './Elevator';
import { calculateRouteCost } from './routeUtils';

export class RoutePlannerNode {
  unserved = 0;

  constructor(
    public floor: number,
    public entering: number = 0,
    public exiting: number = 0,
  ) {
    this.unserved = entering + exiting;
  }

  update(node: RoutePlannerNode) {
    this.entering += node.entering;
    this.exiting += node.exiting;
    this.unserved += node.unserved;
  }

  servePassengers(passengers: number) {
    this.unserved -= passengers;
  }

  hasUnservedPassengers() {
    return this.unserved > 0;
  }
}

export class RoutePlanner {
  nodes: RoutePlannerNode[] = [];

  constructor(public elevator: Elevator) {}

  requestNode() {
    this.update();
    return this.nodes[0];
  }

  update() {
    if (this.nodes[0] && !this.nodes[0].hasUnservedPassengers()) {
      this.nodes.shift();
    }
  }

  findBestRoute(initialFloor: number, finalFloor: number) {
    const routes = [];

    for (let i = 0; i < this.nodes.length + 1; i++) {
      for (let j = i; j < this.nodes.length + 1; j++) {
        const nodes = [...this.nodes];
        nodes.splice(i, 0, new RoutePlannerNode(initialFloor, 1, 0));
        nodes.splice(j + 1, 0, new RoutePlannerNode(finalFloor, 0, 1));

        const cost = calculateRouteCost(this.elevator, nodes, i, j + 1);
        routes.push([nodes, cost] as const);
      }
    }

    routes.sort((r1, r2) => r1[1] - r2[1]);
    return routes[0];
  }
}
