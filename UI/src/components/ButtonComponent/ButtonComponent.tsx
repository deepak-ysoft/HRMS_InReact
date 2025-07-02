import { ButtonProps } from "../../types/IButtonProps.type";
import { FaSpinner } from "react-icons/fa";

export const Button: React.FC<ButtonProps & { children?: React.ReactNode }> = ({
  type,
  text,
  onClick,
  disabled = false,
  isSubmitting = false,
  className = "",
  title = "",
  children,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isSubmitting}
      className={`py-2 px-4 rounded-lg text-white flex items-center justify-center gap-2 ${className} ${
        disabled || isSubmitting ? "opacity-50 cursor-not-allowed" : ""
      }`}
      title={title}
    >
      {isSubmitting ? <FaSpinner className="animate-spin" /> : children ?? text}
    </button>
  );
};
