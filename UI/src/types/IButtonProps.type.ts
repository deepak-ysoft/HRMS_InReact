export interface ButtonProps {
  type: "submit" | "button"; // Specify types for validation
  text: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isSubmitting?: boolean;
  className?: string;
  size?: "small" | "medium" | "large";
  title?: string;
}
