import { ChangeEvent } from "react";

export interface Option {
  value: string;
  label: string;
}

export interface FormFieldProps {
  type:
    | "input"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "date"
    | "file"
    | "number";
  inputType?: string;
  label: string;
  name: string;
  value?: string | number | boolean; // Make value optional
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  error?: string | undefined;
  className?: string;
  accept?: string;
  checked?: boolean;
}
