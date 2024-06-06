import clsx from 'clsx';
import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  className,
  ...props
}: Readonly<Props>) {
  return (
    <button
      className={clsx(
        `
          bg-teal-500 h-[40px] min-w-[150px]
          text-xs tracking-wide font-bold text-white text-nowrap
          rounded uppercase shadow
        `,
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
