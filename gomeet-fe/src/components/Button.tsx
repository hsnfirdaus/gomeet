import { LoaderCircleIcon } from "lucide-react";
import React from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  isLoading?: boolean;
  variant?: "primary" | "default";
  children?: React.ReactNode;
  icon?: React.ReactNode;
  isCircle?: boolean;
}
const Button: React.FC<Props> = ({
  variant,
  children,
  isLoading,
  icon,
  isCircle,
  className,
  disabled,
  ...rest
}) => (
  <button
    {...rest}
    disabled={disabled}
    className={`${
      variant === "primary"
        ? disabled
          ? "bg-rose-600/40 text-white/40"
          : "bg-rose-600 hover:bg-rose-700 text-white"
        : disabled
        ? "bg-gray-900/40 text-white/40"
        : "bg-gray-900 hover:bg-gray-800 text-white"
    } rounded-full transition-colors inline-flex items-center justify-center gap-2 ${
      isCircle ? "h-10 w-10" : "py-2 px-4"
    } ${className}`}
  >
    {isLoading ? (
      <LoaderCircleIcon className="inline-block animate-spin h-4" />
    ) : (
      icon
    )}
    {children}
  </button>
);
export default Button;
