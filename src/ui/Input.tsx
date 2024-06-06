import clsx from 'clsx';
import React from 'react';

type Props = {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  className?: string;
  label: string;
};

export default function Input({
  inputProps,
  className,
  label,
}: Readonly<Props>) {
  return (
    <div className={clsx('flex flex-col w-full', className)}>
      <label htmlFor={inputProps.id} className='text-sm font-medium text-white'>
        {label}
      </label>
      <input
        id={label}
        {...inputProps}
        className={clsx('rounded p-2 outline-none', inputProps.className)}
      />
    </div>
  );
}
