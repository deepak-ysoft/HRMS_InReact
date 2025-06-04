import { RegisterOptions, UseFormRegisterReturn } from "react-hook-form";

type Option = {
  label: string;
  value: string;
  style?: string; // Optional style property for each option
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
  | "file"
  | "date"
  | "datetime-local"
  | "search"
  | "hidden";

export interface CustomInputProps {
  label: string;
  name: string;
  type?: InputType;
  value?: string | number | boolean | File | null | undefined; // Support string, number, boolean, File, null, or undefined

  onBlur?: React.FocusEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  required?: boolean;
  error?: string | number | null; // Ensure error is string, number, or null only
  placeholder?: string;
  options?: Option[]; // Used for radio and select
  className?: string;
  rows?: number; // Used for textarea
  disabled?: boolean; // <-- add this line
  lableClass?: string;
  register?: (name: string, options?: RegisterOptions) => UseFormRegisterReturn; // 👈 Add this
  validation?: {
    required?: string | boolean;
    maxLength?: {
      value: number;
      message: string;
    };
  };
}
