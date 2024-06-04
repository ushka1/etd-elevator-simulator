import { Building } from '@/core/Building';
import { ElevatorSystem } from '@/core/ElevatorSystem';
import { useState } from 'react';

const defaultBuilding = new Building(0, new Array(10).fill(2));
const defaultSystem = new ElevatorSystem(defaultBuilding);
defaultSystem.addElevator({
  id: 'A',
});
defaultSystem.addElevator({
  id: 'B',
});
defaultSystem.addElevator({
  id: 'C',
});

defaultSystem.addRoute(0, 5);
defaultSystem.addRoute(3, 5);
defaultSystem.addRoute(0, 5);
defaultSystem.addRoute(0, 7);
defaultSystem.addRoute(3, 5);
defaultSystem.addRoute(5, 3);

export default function MainPage() {
  const [system, setSystem] = useState(defaultSystem);
  const { building, elevators } = system.getState();

  return (
    <div className='flex flex-col p-8'>
      <h1 className='text-3xl font-bold text-center'>ETD Elevator Simulator</h1>
      <div className='flex mt-8'>
        <div className='basis-9/12'>
          <h3 className='text-xl font-bold'>Building</h3>
          <ul className='mt-2'>
            <li>Floors count: {building.floorsHeights.length}</li>
            <li>
              Floors heights:{' '}
              {building.floorsHeights.map((height) => height).join(', ')}
            </li>
          </ul>
          <h3 className='text-xl font-bold mt-8'>Elevators</h3>
          <ul className='mt-2'>
            {elevators.map((elevator) => (
              <li key={elevator.config.id} className='mt-2 first:mt-0'>
                <p>
                  {elevator.config.id} | state={elevator.stateTitle} | floor=
                  {elevator.floor} | elevation={elevator.elevation}
                </p>
                <p>
                  Route:{' '}
                  {elevator.routePlanner.route.map((n, i) => (
                    <span key={i}>{n.floor} &rarr; </span>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className='basis-3/12'></div>
      </div>
    </div>
  );
}
