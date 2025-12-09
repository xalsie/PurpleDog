'use client';

interface InputFieldProps {
    label: string;
    name: string;
    type: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeHolder : string
}

export default function InputField({ label, name, type, onChange, error, placeHolder } : InputFieldProps) {
    return (
        <div>
        <label className="text-black">{label}</label>
        <input name={name} type={type} onChange={onChange} placeholder={placeHolder} className="border-solid border-2 border-black text-black"/>
        {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}
