import { Elevator } from './Elevator';
import { RouteNode } from './RoutePlanner';
import {
  calculateElevatorToFloorTime,
  calculateFloorServiceTime,
  calculateFloorToFloorTime,
} from './timeUtils';

export function calculateRouteCost(
  elevator: Elevator,
  nodes: RouteNode[],
  idx1: number,
  idx2: number,
): number {
  const routeLength = nodes.length;

  let routeTime = 0;
  let delayedPassengers1 = 0;
  let delayedPassengers2 = 0;

  for (let i = 0; i < nodes.length; i++) {
    const prev = i > 0 ? nodes[i - 1] : null;
    const curr = nodes[i];

    let time = 0;
    if (i === 0) {
      time = calculateElevatorToFloorTime(elevator, curr.floor);
    } else if (i <= idx2) {
      time = calculateFloorToFloorTime(elevator, prev?.floor!, curr.floor);
    }
    if (time > 0) {
      time += calculateFloorServiceTime(elevator);
    }
    routeTime += time;

    if (idx1 < i && i < idx2) {
      if (nodes[idx1].floor !== curr.floor) {
        delayedPassengers1 += curr.exiting;
      }
    }
    if (idx2 < i) {
      if (nodes[idx2].floor !== curr.floor) {
        delayedPassengers1 += curr.exiting;
        delayedPassengers2 += curr.exiting;
      }
    }
  }

  if (idx1 + 1 === idx2) {
    const node1 = idx1 > 0 ? nodes[idx1 - 1] : null;
    const node2 = nodes[idx1];
    const node3 = nodes[idx2];
    const node4 = idx2 + 1 < routeLength ? nodes[idx2 + 1] : null;

    let o1 = 0;
    let d1 = 0;
    let d2 = 0;
    let d3 = 0;

    if (node1 && node4) {
      o1 = calculateFloorToFloorTime(elevator, node1.floor, node2.floor);
    } else if (node4) {
      o1 = calculateElevatorToFloorTime(elevator, node4.floor);
    }

    if (node1) {
      d1 = calculateFloorToFloorTime(elevator, node1.floor, node2.floor);
    } else {
      d1 = calculateElevatorToFloorTime(elevator, node2.floor);
    }

    d2 = calculateFloorToFloorTime(elevator, node2.floor, node3.floor);

    if (node4) {
      d3 = calculateFloorToFloorTime(elevator, node3.floor, node4.floor);
    }

    if (o1 > 0) o1 += calculateFloorServiceTime(elevator);
    if (d1 > 0) d1 += calculateFloorServiceTime(elevator);
    if (d2 > 0) d2 += calculateFloorServiceTime(elevator);
    if (d3 > 0) d3 += calculateFloorServiceTime(elevator);

    const delay = d1 + d2 + d3 - o1;
    return routeTime + delay * delayedPassengers2;
  } else {
    const node1 = idx1 > 0 ? nodes[idx1 - 1] : null;
    const node2 = nodes[idx1];
    const node3 = nodes[idx1 + 1];
    let o1 = 0;
    let d1 = 0;
    let d2 = 0;

    if (node1) {
      d1 = calculateFloorToFloorTime(elevator, node1.floor, node2.floor);
      o1 = calculateFloorToFloorTime(elevator, node1.floor, node3.floor);
    } else {
      d1 = calculateElevatorToFloorTime(elevator, node2.floor);
      o1 = calculateElevatorToFloorTime(elevator, node3.floor);
    }
    d2 = calculateFloorToFloorTime(elevator, node2.floor, node3.floor);

    if (d1 > 0) d1 += calculateFloorServiceTime(elevator);
    if (d2 > 0) d2 += calculateFloorServiceTime(elevator);
    if (o1 > 0) o1 += calculateFloorServiceTime(elevator);

    const node4 = nodes[idx2 - 1];
    const node5 = nodes[idx2];
    const node6 = idx2 + 1 < routeLength ? nodes[idx2 + 1] : null;
    let o2 = 0;
    let d3 = 0;
    let d4 = 0;

    d3 = calculateFloorToFloorTime(elevator, node4.floor, node5.floor);
    if (node6) {
      d4 = calculateFloorToFloorTime(elevator, node5.floor, node6.floor);
      o2 = calculateFloorToFloorTime(elevator, node4.floor, node6.floor);
    }

    if (d3 > 0) d3 += calculateFloorServiceTime(elevator);
    if (d4 > 0) d4 += calculateFloorServiceTime(elevator);
    if (o2 > 0) o2 += calculateFloorServiceTime(elevator);

    const delay1 = d1 + d2 - o1;
    const delay2 = d3 + d4 - o2;

    return (
      routeTime + delay1 * delayedPassengers1 + delay2 * delayedPassengers2
    );
  }
}
