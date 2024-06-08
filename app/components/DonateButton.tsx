'use client'

import React, { useState } from "react";

interface DonateButtonsProps {
  name: string;
  options: { value: number }[];
  defaultValue: number;
}

export const DonateButtons: React.FC<DonateButtonsProps> = ({
  name,
  options,
  defaultValue,
}) => {
  const [amount, setAmount] = useState(defaultValue);

  const onChange = (value: number) => {
    setAmount(value);
  };

  return (
    <ul className="flex flex-col items-center gap-2">
      {options.map((option) => (
        <li key={option.value} className="w-full">
          <DonateButton
            name={name}
            value={option.value}
            checked={option.value === amount}
            onClick={onChange}
          />
        </li>
      ))}
    </ul>
  );
};

interface DonateButtonProps {
  name: string;
  value: number;
  checked?: boolean;
  onClick: (value: number) => void;
}

const DonateButton: React.FC<DonateButtonProps> = ({
  value,
  name,
  checked,
  onClick,
}) => {
  return (
    <div className="w-full">
      <input
        type="radio"
        id={`radio-${value}`}
        name={name}
        value={value}
        checked={checked}
        onClick={() => onClick(value)}
        className="sr-only peer"
      />

      <label
        htmlFor={`radio-${value}`}
        className="block rounded-xl w-full py-3 px-5 focus:outline-none ring-1 ring-gray-300 peer-checked:ring-2 peer-checked:ring-green-400 peer-checked:bg-green-300/5 cursor-pointer"
      >
        ${value}
      </label>
    </div>
  );
};