import { Elevator } from './Elevator';
import { RouteNode } from './RoutePlanner';
import {
  calculateElevatorToFloorWithServiceTime,
  calculateFloorToFloorWithServiceTime,
} from './timeUtils';

export function calculateRouteCost(
  elevator: Elevator,
  route: RouteNode[],
  idx1: number,
  idx2: number,
): number {
  let routeTime = 0; // Total route time of inserted passenger.
  let delayedPassengers1 = 0; // Number of passengers delayed by the first insertion.
  let delayedPassengers2 = 0; // Number of passengers delayed by the second insertion.

  for (let i = 0; i < route.length; i++) {
    const prev = i > 0 ? route[i - 1] : null;
    const curr = route[i];

    if (i === 0) {
      routeTime += calculateElevatorToFloorWithServiceTime(
        elevator,
        curr.floor,
      );
    } else if (i <= idx2) {
      routeTime += calculateFloorToFloorWithServiceTime(
        elevator,
        prev!.floor,
        curr.floor,
      );
    }

    if (idx1 < i && i < idx2) {
      delayedPassengers1 += curr.exiting;
    }
    if (idx2 < i) {
      delayedPassengers1 += curr.exiting;
      delayedPassengers2 += curr.exiting;
    }
  }

  if (idx1 + 1 === idx2) {
    const node1 = idx1 > 0 ? route[idx1 - 1] : null;
    const node2 = route[idx1];
    const node3 = route[idx2];
    const node4 = idx2 + 1 < route.length ? route[idx2 + 1] : null;

    let o1 = 0;
    let d1 = 0;
    let d2 = 0;
    let d3 = 0;

    if (node1 && node4) {
      o1 = calculateFloorToFloorWithServiceTime(
        elevator,
        node1.floor,
        node2.floor,
      );
    } else if (node4) {
      o1 = calculateElevatorToFloorWithServiceTime(elevator, node4.floor);
    }

    if (node1) {
      d1 = calculateFloorToFloorWithServiceTime(
        elevator,
        node1.floor,
        node2.floor,
      );
    } else {
      d1 = calculateElevatorToFloorWithServiceTime(elevator, node2.floor);
    }

    d2 = calculateFloorToFloorWithServiceTime(
      elevator,
      node2.floor,
      node3.floor,
    );

    if (node4) {
      d3 = calculateFloorToFloorWithServiceTime(
        elevator,
        node3.floor,
        node4.floor,
      );
    }

    const delay = (d1 + d2 + d3 - o1) * delayedPassengers1;
    return routeTime + delay;
  } else {
    const node1 = idx1 > 0 ? route[idx1 - 1] : null;
    const node2 = route[idx1];
    const node3 = route[idx1 + 1];
    let o1 = 0;
    let d1 = 0;
    let d2 = 0;

    if (node1) {
      d1 = calculateFloorToFloorWithServiceTime(
        elevator,
        node1.floor,
        node2.floor,
      );
      o1 = calculateFloorToFloorWithServiceTime(
        elevator,
        node1.floor,
        node3.floor,
      );
    } else {
      d1 = calculateElevatorToFloorWithServiceTime(elevator, node2.floor);
      o1 = calculateElevatorToFloorWithServiceTime(elevator, node3.floor);
    }

    d2 = calculateFloorToFloorWithServiceTime(
      elevator,
      node2.floor,
      node3.floor,
    );

    const node4 = route[idx2 - 1];
    const node5 = route[idx2];
    const node6 = idx2 + 1 < route.length ? route[idx2 + 1] : null;
    let o2 = 0;
    let d3 = 0;
    let d4 = 0;

    d3 = calculateFloorToFloorWithServiceTime(
      elevator,
      node4.floor,
      node5.floor,
    );

    if (node6) {
      d4 = calculateFloorToFloorWithServiceTime(
        elevator,
        node5.floor,
        node6.floor,
      );
      o2 = calculateFloorToFloorWithServiceTime(
        elevator,
        node4.floor,
        node6.floor,
      );
    }

    const delay1 = (d1 + d2 - o1) * delayedPassengers1;
    const delay2 = (d3 + d4 - o2) * delayedPassengers2;
    const delay = delay1 + delay2;
    return routeTime + delay;
  }
}
