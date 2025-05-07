import React from "react";

type Option = {
  label: string;
  value: string;
};

type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "file";

interface CustomInputProps {
  label: string;
  name: string;
  type?: InputType;
  value: string | number | boolean | File | null | undefined; // Support string, number, boolean, File, null, or undefined
  onChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  onBlur?: React.FocusEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  required?: boolean;
  error?: string | number | null; // Ensure error is string, number, or null only
  placeholder?: string;
  options?: Option[]; // Used for radio and select
}

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
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block font-medium mb-1 capitalize">
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
          className="w-full border px-3 py-2 rounded"
        />
      ) : type === "select" ? (
        <select
          id={name}
          name={name}
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "radio" ? (
        <div>
          {options.map((opt) => (
            <label key={opt.value} className="mr-4">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={onChange}
                onBlur={onBlur}
                className="mr-1"
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
            className="mr-2"
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
            className="w-full border px-3 py-2 rounded"
          />
          {value && value instanceof File && (
            <p className="text-sm mt-1">
              Selected File: {(value as File).name}
            </p>
          )}
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
          className="w-full border px-3 py-2 rounded"
        />
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CustomInput;
