'use client'

import React, { useState, useEffect } from 'react';
import AddressForm, { AddressData } from './AddressForm';
import { useAddressManagement } from '@/hooks/useAddressManagement';

interface BillingAddressFormProps {
    shippingAddress: AddressData;
    onSubmit: (data: AddressData) => void;
    loading?: boolean;
}

export type BillingAddressData = AddressData;

export default function BillingAddressForm({
    shippingAddress,
    onSubmit,
    loading: externalLoading = false,
}: BillingAddressFormProps) {
    const { saveBillingAddress, getAddresses, loading } = useAddressManagement();
    const [useSameAddress, setUseSameAddress] = useState(true);
    const [initialBillingData, setInitialBillingData] = useState<AddressData | undefined>();

    useEffect(() => {
        const loadAddresses = async () => {
            const addresses = await getAddresses();
            if (addresses && addresses.length > 0) {
                const billingAddr = addresses.find((addr: any) => addr.type === 'billing');
                if (billingAddr) {
                    setInitialBillingData({
                        name: billingAddr.name,
                        line1: billingAddr.line1,
                        line2: billingAddr.line2,
                        city: billingAddr.city,
                        postalCode: billingAddr.postalCode,
                        country: billingAddr.country,
                        phone: billingAddr.phone,
                    });
                    setUseSameAddress(false);
                }
            }
        };
        loadAddresses();
    }, []);

    const handleSubmit = async (data: AddressData) => {
        // Save to database
        const saved = await saveBillingAddress(data);
        if (saved) {
            onSubmit(data);
        }
    };

    const handleUseSameAddress = (use: boolean) => {
        setUseSameAddress(use);
        if (use) {
            // Directly submit with shipping address
            handleSubmit(shippingAddress);
        }
    };

    return (
        <AddressForm
            title="Adresse de facturation"
            initialData={useSameAddress ? shippingAddress : initialBillingData}
            onSubmit={handleSubmit}
            loading={loading || externalLoading}
            submitButtonLabel="Continuer vers le paiement"
            showSameAsOption={true}
            onUseSameAddress={handleUseSameAddress}
            useSameAddressLabel="Utiliser la même adresse que l'adresse de livraison"
        />
    );
}
