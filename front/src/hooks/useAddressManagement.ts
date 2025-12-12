'use client'

import { useState, useCallback } from 'react';
import axiosInstance from '@/lib/axios';
import { AddressData } from '@/components/sections/Payment/AddressForm';

export const useAddressManagement = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const saveShippingAddress = useCallback(
        async (address: AddressData): Promise<boolean> => {
            try {
                setLoading(true);
                setError(null);

                const response = await axiosInstance.post('/user/addresses/shipping', address);
                return true;
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
                setError(errorMessage);
                console.error('Error saving shipping address:', err);
                return false;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const saveBillingAddress = useCallback(
        async (address: AddressData): Promise<boolean> => {
            try {
                setLoading(true);
                setError(null);

                await axiosInstance.post('/user/addresses/billing', address);
                return true;
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
                setError(errorMessage);
                console.error('Error saving billing address:', err);
                return false;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const getAddresses = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/user/addresses');
            const addresses = Array.isArray(response.data) ? response.data : response.data.data || [];
            return addresses;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Erreur lors du chargement';
            setError(errorMessage);
            console.error('Error fetching addresses:', err);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        saveShippingAddress,
        saveBillingAddress,
        getAddresses,
        loading,
        error,
    };
};
