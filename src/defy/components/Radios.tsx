import React from 'react';

interface Props {
  id: string;
  name: string;
  value: string;
  labelTxt: string;
  changeCb: (event: React.FormEvent<HTMLInputElement>) => void;
  currentValue: string;
}

export const Radio = ({
  id,
  name,
  value,
  labelTxt,
  changeCb,
  currentValue
}: Props) => {
  return (
    <label htmlFor={id}>
      <input
        className="radios-input"
        id={id}
        name={name}
        type="radio"
        value={value}
        checked={value === currentValue}
        onChange={changeCb}
      />
      <div className="radios-mark">
        <div className="radios-label">{labelTxt}</div>
      </div>
    </label>
  );
};
