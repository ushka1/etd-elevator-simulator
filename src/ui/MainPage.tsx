import { Building } from '@/core/Building';
import { ElevatorSystem } from '@/core/ElevatorSystem';

import ElevatorTile from './ElevatorTile';

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
defaultSystem.addRoute(0, 5);
defaultSystem.addRoute(3, 5);
defaultSystem.addRoute(0, 5);
defaultSystem.addRoute(0, 7);
defaultSystem.addRoute(3, 5);
defaultSystem.addRoute(5, 3);

function getColor(index: number) {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-teal-500',
    'bg-sky-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
  ];

  return colors[index % colors.length];
}

export default function MainPage() {
  const { elevators } = defaultSystem.getState();

  return (
    <div>
      <div className='w-full p-4 flex gap-x-4 overflow-x-auto'>
        {elevators.map((elevator, i) => (
          <ElevatorTile
            key={elevator.config.id}
            color={getColor(i)}
            elevator={elevator}
          />
        ))}
      </div>
    </div>
  );
}
