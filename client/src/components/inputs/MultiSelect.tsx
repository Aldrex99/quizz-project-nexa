import { classNames } from "@/utils/style";
import { CheckCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type TMultiSelectProps = {
  text: string;
  options: { key: string; value: string }[];
  selectedOptions: string[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function MultiSelect({
  text,
  options,
  selectedOptions,
  setSelectedOptions,
}: TMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="absolute left-0 top-0 h-screen w-screen"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className="relative">
        <button
          className={classNames(
            isOpen ? "rounded-t-md border-b-0" : "rounded-md",
            "flex w-full items-center justify-between border border-themedBorder bg-themedFg p-2",
          )}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="max-w-[95%] truncate whitespace-nowrap text-themedText">
            {selectedOptions.length > 0
              ? selectedOptions
                  .map((option) => options.find((o) => o.key === option)?.value)
                  .sort()
                  .join(", ")
              : text}
          </span>
          <ChevronDownIcon className="h-6 w-6 text-themedText" />
        </button>
        {isOpen && (
          <div className="absolute z-10 max-h-40 w-full overflow-y-scroll rounded-b-md border border-t-0 border-themedBorder bg-themedFg shadow-lg">
            {options.map((option) => (
              <button
                key={option.key}
                className={classNames(
                  option.key === options[options.length - 1].key &&
                    "rounded-b-md",
                  "flex w-full items-center space-x-2 p-2 text-themedText hover:bg-themedBg",
                )}
                onClick={() => handleSelect(option.key)}
              >
                <span>{option.value}</span>
                {selectedOptions.includes(option.key) && (
                  <CheckCircleIcon className="h-6 w-6 text-primary" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
