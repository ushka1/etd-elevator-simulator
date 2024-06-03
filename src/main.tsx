import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import './assets/input.css';
import { Building } from './core/Building.ts';
import { Elevator } from './core/Elevator.ts';
import { RouteNode } from './core/RoutePlanner.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

const building = new Building(-1, new Array(10).fill(3));
const elevator = new Elevator(building, { id: 'A', baseFloor: 0 });

elevator.routePlanner.updateRoute([
  new RouteNode(1, 1, 0),
  new RouteNode(7, 0, 1),
]);

for (let i = 0; i < 40; i++) {
  elevator.addTime(1000);
  console.log(elevator.stateTitle, '|', elevator.elevation);
}

elevator.routePlanner.updateRoute([
  new RouteNode(7, 1, 0),
  new RouteNode(7, 1, 0),
  new RouteNode(7, 1, 0),
]);

for (let i = 0; i < 40; i++) {
  elevator.addTime(1000);
  console.log(elevator.stateTitle, '|', elevator.elevation);
}

console.log(elevator.passengerCount);
