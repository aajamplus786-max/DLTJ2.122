// =====================================================
// DLTJ2.0
// STEP 2
// FILE: src/components/common/Button.tsx
// =====================================================

import type {
    ButtonHTMLAttributes,
    ReactNode,
  } from "react";
  
  interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "outline";
    fullWidth?: boolean;
  }
  
  export default function Button({
    children,
    variant = "primary",
    fullWidth = false,
    className = "",
    ...props
  }: ButtonProps) {
    return (
      <button
        className={`dltj-button dltj-button-${variant} ${
          fullWidth ? "dltj-button-full" : ""
        } ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }