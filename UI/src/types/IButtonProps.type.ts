export interface ButtonProps {
  type: "button" | "submit" | "reset";
  onClick?: () => void | Promise<void>;
  text?: React.ReactNode; // ✅ allow string or React element
  disabled?: boolean;
  isSubmitting?: boolean;
  className?: string;
  title?: string;
}
