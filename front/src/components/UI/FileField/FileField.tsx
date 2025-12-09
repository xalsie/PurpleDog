"use client";

interface FileFieldProps {
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string
}


export default function FileField({ label, name, onChange, error } : FileFieldProps) {
  return (
    <div>
      <label className="text-black">{label}</label>
      <input type="file" name={name} onChange={onChange} className="border-solid border-2 border-black text-black"/>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}