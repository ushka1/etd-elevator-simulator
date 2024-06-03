import { Elevator } from './Elevator';
import { calculateRouteCost } from './routeUtils';

export class RouteNode {
  constructor(
    public floor: number,
    public entering: number = 0,
    public exiting: number = 0,
  ) {}
}

export class RoutePlanner {
  route: RouteNode[] = [];

  constructor(public elevator: Elevator) {}

  previewNode(): RouteNode | undefined {
    return this.route[0];
  }

  consumeNode(): RouteNode | undefined {
    return this.route.shift();
  }

  findBestRoute(initialFloor: number, finalFloor: number): RouteNode[] {
    const routes = [];

    for (let i = 0; i < this.route.length + 1; i++) {
      for (let j = i; j < this.route.length + 1; j++) {
        const nodes = [...this.route];
        nodes.splice(i, 0, new RouteNode(initialFloor, 1, 0));
        nodes.splice(j + 1, 0, new RouteNode(finalFloor, 0, 1));

        const cost = calculateRouteCost(this.elevator, nodes, i, j + 1);
        routes.push([nodes, cost] as const);
      }
    }

    routes.sort((r1, r2) => r1[1] - r2[1]);
    return routes[0][0];
  }

  updateRoute(route: RouteNode[]) {
    this.route = route;
  }
}
