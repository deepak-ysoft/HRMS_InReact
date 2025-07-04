import {
  FieldValues,
  Path,
  UseFormRegister,
  UseFormSetValue,
  RegisterOptions,
  FieldError,
  PathValue,
} from "react-hook-form";
import InputBaseStyle, {
  FileInputStyle,
  SelectBaseStyle,
  TextareaBaseStyle,
} from "../../utils/commonCSS";

// Common base
type CommonProps<
  TValues extends FieldValues,
  TFieldName extends Path<TValues>
> = {
  className?: string;
  name: TFieldName;
  label?: string;
  labelClassName?: string;
  isRequired?: boolean;
  error?: FieldError;
  registerOptions?: RegisterOptions<TValues, TFieldName>;
  disabled?: boolean;
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void; // <-- Added here
};

// For input-like fields
type TextProps<
  TValues extends FieldValues,
  TFieldName extends Path<TValues>
> = CommonProps<TValues, TFieldName> & {
  type:
    | "text"
    | "textarea"
    | "email"
    | "password"
    | "number"
    | "date"
    | "datetime-local";
  placeholder?: string;
  rows?: number;
  register: UseFormRegister<TValues>;
};

type SelectProps<
  TValues extends FieldValues,
  TFieldName extends Path<TValues>
> = CommonProps<TValues, TFieldName> & {
  type: "select";
  options: { value: string | number; label: string }[];
  register: UseFormRegister<TValues>;
};

type FileProps<
  TValues extends FieldValues,
  TFieldName extends Path<TValues>
> = CommonProps<TValues, TFieldName> & {
  type: "file";
  setValue: UseFormSetValue<TValues>;
};
type RadioProps<
  TValues extends FieldValues,
  TFieldName extends Path<TValues>
> = CommonProps<TValues, TFieldName> & {
  type: "radio";
  register: UseFormRegister<TValues>;
  registerOptions?: RegisterOptions<TValues, TFieldName>;
  options: { value: string; label: string; style?: string }[];
};

type FormFieldProps<
  TValues extends FieldValues,
  TFieldName extends Path<TValues>
> =
  | TextProps<TValues, TFieldName>
  | SelectProps<TValues, TFieldName>
  | FileProps<TValues, TFieldName>
  | RadioProps<TValues, TFieldName>;

export const FormField = <
  TValues extends FieldValues,
  TFieldName extends Path<TValues>
>(
  props: FormFieldProps<TValues, TFieldName>
) => {
  const { name, label, error, onChange } = props;

  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && (
        <label
          htmlFor={name}
          className={`${props.labelClassName} block font-medium mb-1 capitalize`}
        >
          {label}
          {props.isRequired && <span style={{ color: "red" }}>*</span>}
        </label>
      )}

      {/* Text inputs */}
      {[
        "text",
        "email",
        "password",
        "number",
        "date",
        "datetime-local",
      ].includes(props.type) &&
        "register" in props &&
        (() => {
          const registerResult = props.register(name, props.registerOptions);
          return (
            <input
              id={name}
              className={`${props.className} ${InputBaseStyle}`}
              type={props.type}
              placeholder={"placeholder" in props ? props.placeholder : ""}
              {...registerResult}
              onChange={(e) => {
                registerResult.onChange(e);
                onChange?.(e);
              }}
              disabled={props.disabled}
            />
          );
        })()}

      {/* Textarea */}
      {props.type === "textarea" &&
        "register" in props &&
        (() => {
          const registerResult = props.register(name, props.registerOptions);
          return (
            <textarea
              id={name}
              className={`${props.className} ${TextareaBaseStyle}`}
              placeholder={"placeholder" in props ? props.placeholder : ""}
              rows={props.rows || 3}
              {...registerResult}
              onChange={(e) => {
                registerResult.onChange(e);
                onChange?.(e);
              }}
              disabled={props.disabled}
            />
          );
        })()}

      {/* Select */}
      {props.type === "select" &&
        "register" in props &&
        (() => {
          const registerResult = props.register(name, props.registerOptions);
          return (
            <select
              id={name}
              {...registerResult}
              className={`${props.className} ${SelectBaseStyle}`}
              onChange={(e) => {
                registerResult.onChange(e);
                onChange?.(e);
              }}
              disabled={props.disabled}
            >
              <option value="">Select an option</option>
              {props.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );
        })()}

      {/* File input */}
      {props.type === "file" && (
        <input
          id={name}
          type="file"
          className={`${FileInputStyle} ${props.className}`}
          onChange={(e) => {
            const files = e.target.files;
            const fileListValue = files as PathValue<TValues, TFieldName>;
            props.setValue(name, fileListValue, { shouldValidate: true });

            onChange?.(e);
          }}
          disabled={props.disabled}
        />
      )}

      {/* Radio */}
      {props.type === "radio" && "register" in props && (
        <div className="flex gap-4 mt-2">
          {props.options.map((opt) => {
            const registerResult = props.register(name, props.registerOptions);
            return (
              <label
                key={opt.value}
                className={`flex items-center gap-1 ${opt.style}`}
              >
                <input
                  type="radio"
                  value={opt.value}
                  {...registerResult}
                  onChange={(e) => {
                    registerResult.onChange(e);
                    onChange?.(e);
                  }}
                  disabled={props.disabled}
                />
                {opt.label}
              </label>
            );
          })}
        </div>
      )}

      {/* Error */}
      {error && (
        <p style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          {error.message}
        </p>
      )}
    </div>
  );
};
