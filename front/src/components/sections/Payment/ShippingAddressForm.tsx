'use client'

import React, { useState, useEffect } from 'react';
import AddressForm, { AddressData } from './AddressForm';
import { useAddressManagement } from '@/hooks/useAddressManagement';

interface ShippingAddressFormProps {
    onSubmit: (data: AddressData) => void;
    loading?: boolean;
}

export type ShippingAddressData = AddressData;

export default function ShippingAddressForm({
    onSubmit,
    loading: externalLoading = false,
}: ShippingAddressFormProps) {
    const { saveShippingAddress, getAddresses, loading } = useAddressManagement();
    const [initialData, setInitialData] = useState<AddressData | undefined>();

    useEffect(() => {
        const loadAddresses = async () => {
            const addresses = await getAddresses();
            if (addresses && addresses.length > 0) {
                const shippingAddr = addresses.find((addr: any) => addr.type === 'shipping');
                if (shippingAddr) {
                    setInitialData({
                        name: shippingAddr.name,
                        line1: shippingAddr.line1,
                        line2: shippingAddr.line2,
                        city: shippingAddr.city,
                        postalCode: shippingAddr.postalCode,
                        country: shippingAddr.country,
                        phone: shippingAddr.phone,
                    });
                }
            }
        };
        loadAddresses();
    }, []);

    const handleSubmit = async (data: AddressData) => {
        const saved = await saveShippingAddress(data);
        if (saved) {
            onSubmit(data);
        }
    };

    return (
        <AddressForm
            title="Adresse de livraison"
            initialData={initialData}
            onSubmit={handleSubmit}
            loading={loading || externalLoading}
            submitButtonLabel="Continuer vers la facturation"
        />
    );
}
