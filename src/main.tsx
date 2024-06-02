import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import './assets/input.css';
import { Building } from './core/Building.ts';
import { Elevator } from './core/Elevator.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

const building = new Building(-1, new Array(10).fill(2));
const elevator = new Elevator(building, { id: 'A', baseFloor: 8 });

console.log(elevator.stateTitle, '|', elevator.elevation);
elevator.addTime(2000);
console.log(elevator.stateTitle, '|', elevator.elevation);
elevator.addTime(2000);
console.log(elevator.stateTitle, '|', elevator.elevation);
elevator.addTime(2000);
console.log(elevator.stateTitle, '|', elevator.elevation);
elevator.addTime(2000);
console.log(elevator.stateTitle, '|', elevator.elevation);

elevator.addTime(2000);
console.log(elevator.stateTitle, '|', elevator.doorsOpened);
elevator.addTime(10000);
console.log(elevator.stateTitle, '|', elevator.passengerCount);
elevator.addTime(2000);
console.log(elevator.stateTitle, '|', elevator.doorsOpened);
