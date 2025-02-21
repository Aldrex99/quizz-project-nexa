import { useEffect, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

type TTextInputProps = {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export default function TextInput({
  label,
  type,
  placeholder,
  value,
  onChange,
  className,
}: TTextInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (type === 'password') {
      setShowPassword(false);
    }
  }, [type]);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`relative ${className ?? ''}`}>
      <label
        htmlFor={label}
        className="absolute -top-2 left-2 inline-block rounded-lg bg-themedFg px-1 text-xs font-medium text-themedText"
      >
        {label}
      </label>
      <input
        type={showPassword ? 'text' : type}
        id={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="block w-full rounded-md bg-themedFg px-3 py-1.5 text-base text-themedText outline outline-1 -outline-offset-1 outline-themedBorder placeholder:text-themedPlaceholder focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
      />
      {type === 'password' && (
        <button onClick={handleShowPassword} className="absolute right-2 top-2">
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5 text-primary" />
          ) : (
            <EyeIcon className="h-5 w-5 text-themedPlaceholder" />
          )}
        </button>
      )}
    </div>
  );
}
