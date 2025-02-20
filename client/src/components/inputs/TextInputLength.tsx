import { classNames } from "@/utils/style";

type TTextInputLengthProps = {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  maxLength?: number;
};

export default function TextInputLength({
  label,
  type,
  placeholder,
  value,
  onChange,
  className,
  maxLength,
}: TTextInputLengthProps) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <label
        htmlFor={label}
        className="absolute -top-2 left-2 inline-block rounded-lg bg-themedFg px-1 text-xs font-medium text-themedText"
      >
        {label}
      </label>
      <input
        type={type}
        id={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="block w-full rounded-md bg-themedFg px-3 py-1.5 text-base text-themedText outline outline-1 -outline-offset-1 outline-themedBorder placeholder:text-themedPlaceholder focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
      />
      <p
        className={classNames(
          value.length > maxLength! ? "text-red-500" : "text-themedText",
          "absolute bottom-2 right-2 text-xs",
        )}
      >
        {value.length}/{maxLength}
      </p>
    </div>
  );
}
