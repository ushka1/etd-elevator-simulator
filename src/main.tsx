import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import './assets/input.css';
import { Building } from './core/Building.ts';
import { Elevator } from './core/Elevator.ts';
import { ElevatorMovingState } from './core/ElevatorState.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

const building = new Building(0, [2, 2, 2, 2, 2, 2]);
const elevator = new Elevator(building, { id: 'A' });

let state;

state = new ElevatorMovingState(elevator, 3, {
  passengersEntering: 1,
});
state.addTime(10000);

state = state.nextState!;
state.addTime(10000);

console.log(elevator.doorsOpened);

state = state.nextState!;
state.addTime(10000);

console.log(elevator.passengerCount);

state = state.nextState!;
state.addTime(10000);

console.log(elevator.doorsOpened);
