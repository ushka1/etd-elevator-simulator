import clsx from 'clsx';
import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function IconButton({
  children,
  className,
  ...props
}: Readonly<Props>) {
  return (
    <button
      className={clsx(
        'min-w-[80px] min-h-[40px] flex justify-center items-center rounded text-white shadow',
        className,
        {
          'shadow-none opacity-50': props.disabled,
        },
      )}
      {...props}
    >
      {children}
    </button>
  );
}
