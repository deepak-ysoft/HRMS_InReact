import { ButtonProps } from "../../types/IButtonProps.type";

export const Button: React.FC<ButtonProps> = ({
  type,
  text,
  onClick,
  disabled = false,
  isSubmitting = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isSubmitting}
      className={`py-2 px-4 rounded text-white ${className} ${
        disabled || isSubmitting ? "opacity-50" : ""
      }`}
    >
      {isSubmitting ? "Submitting..." : text}
    </button>
  );
};
