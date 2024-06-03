import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import './assets/input.css';
import { Building } from './core/Building.ts';
import { Elevator } from './core/Elevator.ts';
import { RoutePlannerNode } from './core/RoutePlanner.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

const building = new Building(-1, new Array(10).fill(3));
const elevator = new Elevator(building, { id: 'A', baseFloor: 0 });

elevator.routePlanner.nodes = [
  new RoutePlannerNode(1, 1, 0),
  new RoutePlannerNode(7, 0, 1),
];

console.log(elevator.routePlanner.findBestRoute(3, 4));

// routes.forEach((route) => {
//   console.log(route);
// });

// for (let i = 0; i < 100; i++) {
//   elevator.addTime(1000);
//   console.log(elevator.stateTitle, '|', elevator.elevation);
// }
