'use clients';

interface CheckboxFieldProps {
    label: string;
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

export default function CheckboxField({ label, name, onChange, error } : CheckboxFieldProps) {
    return (
        <div>
            <label className="text-black">
                <input type="checkbox" name={name} onChange={onChange} className="border-solid border-2 border-black text-black"/> {label}
            </label>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}