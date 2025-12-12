'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui';

export interface AddressData {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
}

interface AddressFormProps {
    title: string;
    initialData?: AddressData;
    onSubmit: (data: AddressData) => void;
    loading?: boolean;
    submitButtonLabel?: string;
    showSameAsOption?: boolean;
    onUseSameAddress?: (use: boolean) => void;
    useSameAddressLabel?: string;
}

const defaultCountries = ['France', 'Belgium', 'Germany', 'Italy', 'Spain', 'Netherlands'];

export default function AddressForm({
    title,
    initialData,
    onSubmit,
    loading = false,
    submitButtonLabel = 'Continuer',
    showSameAsOption = false,
    onUseSameAddress,
    useSameAddressLabel,
}: AddressFormProps) {
    const [formData, setFormData] = useState<AddressData>(
        initialData || {
            name: '',
            line1: '',
            line2: '',
            city: '',
            postalCode: '',
            country: 'France',
            phone: '',
        }
    );

    const [useSameAddress, setUseSameAddress] = useState(false);
    const [errors, setErrors] = useState<Partial<AddressData>>({});

    // Update form when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const validateForm = (): boolean => {
        const newErrors: Partial<AddressData> = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.line1.trim()) newErrors.line1 = 'Address line 1 is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
        if (formData.phone && !/^[\d\s\-\+\(\)]{6,}$/.test(formData.phone)) {
            newErrors.phone = 'Invalid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof AddressData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleUseSameAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setUseSameAddress(checked);
        onUseSameAddress?.(checked);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

            {showSameAsOption && useSameAddressLabel && (
                <div className="flex items-center space-x-3 mb-6">
                    <input
                        type="checkbox"
                        id="useSameAddress"
                        checked={useSameAddress}
                        onChange={handleUseSameAddress}
                        className="w-4 h-4 accent-purple-600"
                        disabled={loading}
                    />
                    <label
                        htmlFor="useSameAddress"
                        className="text-sm text-gray-700 cursor-pointer"
                    >
                        {useSameAddressLabel}
                    </label>
                </div>
            )}

            {!useSameAddress && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                            Nom complet *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600"
                            placeholder="John Doe"
                            disabled={loading}
                        />
                        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                            Adresse *
                        </label>
                        <input
                            type="text"
                            name="line1"
                            value={formData.line1}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600"
                            placeholder="123 rue de la Paix"
                            disabled={loading}
                        />
                        {errors.line1 && <p className="text-red-600 text-xs mt-1">{errors.line1}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                            Complément d'adresse
                        </label>
                        <input
                            type="text"
                            name="line2"
                            value={formData.line2}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600"
                            placeholder="Appartement 5B"
                            disabled={loading}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">
                                Ville *
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600"
                                placeholder="Paris"
                                disabled={loading}
                            />
                            {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">
                                Code postal *
                            </label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600"
                                placeholder="75001"
                                disabled={loading}
                            />
                            {errors.postalCode && (
                                <p className="text-red-600 text-xs mt-1">{errors.postalCode}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                            Pays *
                        </label>
                        <select
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:border-purple-600"
                            disabled={loading}
                        >
                            {defaultCountries.map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                            Téléphone
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600"
                            placeholder="+33 6 12 34 56 78"
                            disabled={loading}
                        />
                        {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                    </div>
                </>
            )}

            <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                className="w-full mt-6"
            >
                {loading ? 'Traitement...' : submitButtonLabel}
            </Button>
        </form>
    );
}
