import { Elevator } from '@/core/Elevator';
import { XCircleIcon } from '@heroicons/react/20/solid';
import { Fragment } from 'react/jsx-runtime';
import { useMainContext } from './MainContext';

type Props = {
  elevator: Elevator;
  color: string;
};

export default function ElevatorTile({ color, elevator }: Readonly<Props>) {
  const { removeElevator } = useMainContext();

  return (
    <div className='min-w-[300px] shrink-0 relative'>
      <button
        className='
          absolute top-0 right-0
          mr-2 mt-2 text-white
        '
        onClick={() => removeElevator(elevator.config.id)}
      >
        <XCircleIcon className='size-6' />
      </button>
      <div className={`p-4 text-white ${color} rounded shadow`}>
        <h1 className='text-center font-bold tracking-wide'>
          Elevator {elevator.config.id}
        </h1>
        <div className='mt-2 flex justify-center gap-x-4 text-sm text-nowrap'>
          <ul className='text-right flex-1'>
            <li>State:</li>
            <li>Floor:</li>
            <li>Elevation:</li>
            <li>Passengers:</li>
            <li>Doors:</li>
          </ul>
          <ul className='text-left flex-1'>
            <li>{elevator.stateTitle}</li>
            <li>{elevator.floor ?? '-'}</li>
            <li>{elevator.elevation.toFixed(2)}</li>
            <li>{elevator.passengerCount}</li>
            <li>{elevator.doorsOpened ? 'opened' : 'closed'}</li>
          </ul>
        </div>
      </div>
      <ul className='flex flex-col items-center'>
        {elevator.routePlanner.route.map((node) => {
          return (
            <Fragment key={node.id}>
              <div className='h-8 w-2 bg-gray-300'></div>
              <li
                className={`min-w-[125px] p-4 rounded text-center text-white ${color} shadow`}
              >
                <h1 className='text-sm text-center font-bold tracking-wide'>
                  Floor {node.floor}
                </h1>
                <div className='mt-1 flex justify-center gap-x-2 text-xs text-nowrap'>
                  <ul className='text-right flex-1'>
                    <li>Enter:</li>
                    <li>Exit:</li>
                  </ul>
                  <ul className='text-left flex-1'>
                    <li>{node.entering}</li>
                    <li>{node.exiting}</li>
                  </ul>
                </div>
              </li>
            </Fragment>
          );
        })}
      </ul>
    </div>
  );
}
