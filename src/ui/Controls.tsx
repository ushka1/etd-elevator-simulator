import { PauseIcon, PlayIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import Button from './Button';
import IconButton from './IconButton';
import Input from './Input';
import { useMainContext } from './MainContext';

export default function Controls() {
  const {
    system,
    playing,
    setPlaying,
    cycleMultiplier,
    multiplier,
    requestRoute,
    addTime,
    changeFloors,
    addElevator,
  } = useMainContext();

  const [initialFloor, setInitialFloor] = useState(0);
  const [finalFloor, setFinalFloor] = useState(5);
  const [milliseconds, setMilliseconds] = useState(1000);
  const [minFloor, setMinFloor] = useState(system.building.minFloor);
  const [floorHeights, setFloorHeights] = useState(
    system.building.floorsHeights.toString(),
  );
  const [baseFloor, setBaseFloor] = useState(system.building.minFloor);

  const initialFloorHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const floor = +event.target.value;
    const building = system.building;

    if (floor > building.maxFloor) {
      setInitialFloor(building.maxFloor);
    } else if (floor < building.minFloor) {
      setInitialFloor(building.minFloor);
    } else {
      setInitialFloor(floor);
    }
  };

  const finalFloorHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const floor = +event.target.value;
    const building = system.building;

    if (floor > building.maxFloor) {
      setFinalFloor(building.maxFloor);
    } else if (floor < building.minFloor) {
      setFinalFloor(building.minFloor);
    } else {
      setFinalFloor(floor);
    }
  };

  const millisecondsHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const milliseconds = +event.target.value;

    if (milliseconds >= 0) {
      setMilliseconds(milliseconds);
    } else {
      setMilliseconds(1000);
    }
  };

  const minFloorHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const floor = +event.target.value;
    setMinFloor(floor);
  };

  const floorHeightsHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const building = system.building;

    if (/^[1-9]\d*(,[1-9]\d*)*$/.test(input) && input.length > 0) {
      setFloorHeights(input);
    } else {
      setFloorHeights(building.floorsHeights.toString());
    }
  };

  const baseFloorHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const floor = +event.target.value;
    const building = system.building;

    if (floor > building.maxFloor) {
      setBaseFloor(building.maxFloor);
    } else if (floor < building.minFloor) {
      setBaseFloor(building.minFloor);
    } else {
      setBaseFloor(floor);
    }
  };

  return (
    <div className='sticky bottom-0 flex justify-end'>
      <div
        className='
        w-min p-4 mr-4 mb-4
        flex flex-col gap-y-4
        bg-black bg-opacity-50
        rounded shadow
     '
      >
        <div className='flex gap-x-4 text-sm text-white font-medium tracking-wide'>
          <p>Building {'{'}</p>
          <p>minFloor: {system.building.minFloor}</p>
          <p>floorsHeights: {system.building.floorsHeights.join(',')}</p>
          <p>{'}'}</p>
        </div>
        <div className='flex gap-x-4 items-end'>
          <Input
            inputProps={{
              id: 'initial-floor',
              value: initialFloor,
              type: 'number',
              onChange: initialFloorHandler,
            }}
            label='Initial floor'
          />
          <Input
            inputProps={{
              id: 'final-floor',
              value: finalFloor,
              type: 'number',
              onChange: finalFloorHandler,
            }}
            label='Final floor'
          />
          <Button onClick={() => requestRoute(initialFloor, finalFloor)}>
            Request route
          </Button>
        </div>
        <div className='flex gap-x-4 items-end'>
          <Input
            inputProps={{
              id: 'milliseconds',
              value: milliseconds,
              type: 'number',
              onChange: millisecondsHandler,
            }}
            label='Milliseconds'
          />
          <Button onClick={() => addTime(milliseconds)}>Add time</Button>
        </div>
        <div className='flex gap-x-4 items-end'>
          <Input
            inputProps={{
              id: 'min-floor',
              value: minFloor,
              type: 'number',
              onChange: minFloorHandler,
            }}
            className='w-[100px]'
            label='Min Floor'
          />
          <Input
            inputProps={{
              id: 'floor-heights',
              value: floorHeights.toString(),
              onChange: (e) => {
                setFloorHeights(e.target.value);
              },
              onBlur: floorHeightsHandler,
            }}
            label='Floor heights'
          />
          <Button
            onClick={() => {
              const formatted = floorHeights.split(',').map(Number);
              changeFloors(minFloor, formatted);
            }}
          >
            Update floors
          </Button>
        </div>
        <div className='flex gap-x-4 items-end'>
          <Input
            inputProps={{
              id: 'elevator',
              value: baseFloor,
              type: 'number',
              onChange: baseFloorHandler,
            }}
            label='Base floor'
          />
          <Button
            onClick={() => {
              addElevator(baseFloor);
            }}
          >
            Add elevator
          </Button>
        </div>
        <div className='flex gap-x-4 justify-center mt-4'>
          <IconButton className='bg-blue-500' onClick={() => cycleMultiplier()}>
            {multiplier}X
          </IconButton>
          <IconButton
            className='bg-green-500'
            disabled={playing}
            onClick={() => setPlaying(true)}
          >
            <PlayIcon className='size-6' />
          </IconButton>
          <IconButton
            className='bg-red-500'
            disabled={!playing}
            onClick={() => setPlaying(false)}
          >
            <PauseIcon className='size-6' />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
