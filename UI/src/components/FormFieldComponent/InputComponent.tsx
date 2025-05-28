import React from "react";
import InputBaseStyle, {
  FileInputStyle,
  SelectBaseStyle,
  TextareaBaseStyle,
} from "../../utils/commonCSS";
import { CustomInputProps } from "../../types/ICandidateFormField.types";

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  required = false,
  error,
  placeholder,
  options = [],
  className = "",
  rows = 3,
  disabled = false,
  lableClass = "",
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className={`${lableClass} block font-medium mb-1 capitalize`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={` ${className} ${TextareaBaseStyle}`}
          rows={rows}
          disabled={disabled}
        />
      ) : type === "select" ? (
        <select
          id={name}
          name={name}
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
          className={` ${className} ${SelectBaseStyle}`}
          disabled={disabled}
        >
          <option value="" disabled>
            Select {label}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "radio" ? (
        <div>
          {options.map((opt) => (
            <label key={opt.value} className={`mr-4 ${opt.style}`}>
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={onChange}
                onBlur={onBlur}
                className={` ${className} `}
                disabled={disabled}
              />
              {opt.label}
            </label>
          ))}
        </div>
      ) : type === "checkbox" ? (
        <div>
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={value as boolean}
            onChange={onChange}
            onBlur={onBlur}
            className={` ${className}`}
            disabled={disabled}
          />
        </div>
      ) : type === "file" ? (
        <div>
          <input
            type="file"
            id={name}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            className={`${FileInputStyle}  ${className}`}
            disabled={disabled}
          />
        </div>
      ) : type === "search" ? (
        <div>
          <input
            type={type}
            id={name}
            name={name}
            value={value as string}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={"Search.."}
            className={` ${className}`}
            disabled={disabled}
          />
        </div>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={` ${className} ${InputBaseStyle}`}
          disabled={disabled}
        />
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CustomInput;
