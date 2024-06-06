import { PlusCircleIcon } from '@heroicons/react/20/solid';
import Building from './Building';
import Controls from './Controls';
import ElevatorTile from './ElevatorTile';
import { useMainContext } from './MainContext';
import { getElevatorColor } from './utils';

export default function MainPage() {
  const { system, addElevator } = useMainContext();

  return (
    <>
      <div className='w-full min-h-dvh overflow-x-auto'>
        <div className='w-full p-4 flex gap-x-4'>
          <Building />
          {system.elevators.map((elevator) => (
            <ElevatorTile
              key={elevator.config.id}
              color={getElevatorColor(elevator.config.id)}
              elevator={elevator}
            />
          ))}
          <div className='min-w-[300px] flex items-start justify-center'>
            <button
              className='text-gray-300 mt-[50px]'
              onClick={() => addElevator()}
            >
              <PlusCircleIcon className='size-16' />
            </button>
          </div>
        </div>
        <div className='h-[408px]'>{/* CONTROLS HEIGHT PLACEHOLDER */}</div>
      </div>
      <Controls />
    </>
  );
}
