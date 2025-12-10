"use client";

import { InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

interface FileFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  helperText?: string;
}

export default function FileField({
  label,
  error,
  helperText,
  className,
  ...props
}: FileFieldProps) {
  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        {...props}
        type="file"
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition ${
          error ? "border-red-500" : "border-gray-300"
        } ${className || ""}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      {helperText && !error && (
        <p className="text-xs text-gray-600 mt-2">{helperText}</p>
      )}
    </div>
  );
}