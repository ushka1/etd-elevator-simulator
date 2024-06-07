import { useMainContext } from './MainContext';

export default function Building() {
  const {
    system: { building },
  } = useMainContext();

  const floorNumbers = building.floorsNumbers;
  const floorHeights = building.floorsHeights;
  const n = floorNumbers.length;

  const zipped = [];
  for (let i = 0; i < n; i++) {
    zipped.push([floorNumbers[i], floorHeights[i]]);
  }
  zipped.reverse();

  return (
    <ul>
      {zipped.map((elm) => (
        <li
          key={elm[0]}
          className='w-[80px] h-[80px] bg-gray-300 mb-4 rounded flex flex-col items-center justify-center'
        >
          <p className='text-xs font-bold'>Floor {elm[0]}</p>
          <p className='text-xs mt-1'>Height: {elm[1]}</p>
        </li>
      ))}
    </ul>
  );
}
