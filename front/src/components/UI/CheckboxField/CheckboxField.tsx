"use client";

import { InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

export default function CheckboxField({
  label,
  error,
  ...props
}: CheckboxFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        {...props}
        type="checkbox"
        className="w-4 h-4 text-purple-600 rounded"
      />
      <label htmlFor={props.id} className="text-sm text-gray-700">
        {label}
      </label>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}