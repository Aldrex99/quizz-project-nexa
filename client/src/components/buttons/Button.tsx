import { MouseEventHandler } from 'react';
import { classNames } from '@utils/style';

type TButtonProps = {
  children: React.ReactNode;
  type: 'button' | 'submit' | 'reset';
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'primaryFlat' | 'none';
  defaultPadding?: boolean;
  title?: string;
};

const variants = {
  primary:
    'rounded-md border border-transparent bg-primary text-primary-text hover:bg-primary-gradient focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  secondary: 'rounded-md bg-gray-500 hover:bg-gray-600',
  primaryFlat:
    'rounded-md border-2 border-primary text-primary hover:bg-primary hover:text-primary-text focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  none: '',
};

export default function Button({
  children,
  type,
  onClick,
  disabled,
  title,
  className = '',
  defaultPadding = true,
  variant = 'primary',
}: TButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        'flex h-fit w-fit items-center justify-center font-medium',
        defaultPadding ? 'px-4 py-2' : '',
        `${variants[variant]}`,
        className
      )}
      title={title}
    >
      {children}
    </button>
  );
}
