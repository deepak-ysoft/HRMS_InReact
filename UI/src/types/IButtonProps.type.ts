export interface ButtonProps {
  type: "submit" | "button"; // Specify types for validation
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  isSubmitting?: boolean;
  className?: string;
  size?: "small" | "medium" | "large";
}
