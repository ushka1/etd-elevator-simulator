import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import './assets/input.css';
import { Building } from './core/Building.ts';
import { Elevator } from './core/Elevator.ts';
import { ElevatorController } from './core/ElevatorController.ts';
import { ElevatorRouteNode } from './core/ElevatorRouteNode.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

const building = new Building(0, new Array(10).fill(2));
const elevator = new Elevator(building, { id: 'A', baseFloor: 8 });
const scheduler = new ElevatorController(elevator);

const routeNode1 = new ElevatorRouteNode({
  floor: 0,
  passengersEntering: 1,
});
const routeNode2 = new ElevatorRouteNode({
  floor: 6,
  passengersExiting: 1,
});
scheduler.addRoute(
  routeNode1,
  undefined,
  'after',
  routeNode2,
  routeNode1,
  'after',
);

for (let i = 0; i < 100; i++) {
  scheduler.addTime(1000);
  console.log(
    scheduler.activeCommands?.[0]?.title ?? '---',
    '| elevation =',
    elevator.elevation,
    '| passengersAhead = ',
    scheduler.passengersAhead,
  );
}
