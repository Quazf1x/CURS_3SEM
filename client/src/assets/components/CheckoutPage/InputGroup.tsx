import { useState } from "react";

type InputGroupTypes = {
  type: string;
  label: string;
  placeholder: string;
  isRequired: boolean;
  id: string;
  maxLength: number | undefined;
  minLength: number | undefined;
  pattern: string | undefined;
  replacementPattern: string | RegExp;
  replacementPatternSpacing: string;
};

const InputGroup = ({
  type,
  label,
  placeholder,
  isRequired,
  id,
  maxLength,
  minLength,
  pattern,
  replacementPattern,
  replacementPatternSpacing,
}: InputGroupTypes) => {
  const [inputVal, setInputVal] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const maskedValue = value.replace(
      replacementPattern,
      replacementPatternSpacing,
    );
    setInputVal(maskedValue);
  };

  return (
    <>
      <label htmlFor={id} className="payment-input-label">
        {label}
      </label>
      <input
        className="payment-input"
        type={type}
        id={id}
        placeholder={placeholder}
        required={isRequired}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        value={inputVal}
        name={`input-${id}`}
        onChange={handleChange}
      />
    </>
  );
};

export default InputGroup;
