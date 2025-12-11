import type React from "react";

type BaseProps = {
  label: string;
  error?: string;
  helperText?: string;
  className?: string;
};

type FormInputProps = BaseProps & React.InputHTMLAttributes<HTMLInputElement>;
type FormTextareaProps = BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function FormInput({ label, error, helperText, className = "", ...props }: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-[#0b071a]">{label}</label>
      <input
        {...props}
        className={`w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 ${
          error ? "border-red-500 ring-red-200" : "border-gray-200"
        } ${className}`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!error && helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}

export function FormTextarea({ label, error, helperText, className = "", ...props }: FormTextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-[#0b071a]">{label}</label>
      <textarea
        {...props}
        className={`w-full rounded-lg border px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 ${
          error ? "border-red-500 ring-red-200" : "border-gray-200"
        } ${className}`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!error && helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}
