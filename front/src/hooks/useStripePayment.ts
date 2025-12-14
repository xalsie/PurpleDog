'use client'

import { useCallback, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { Stripe as StripeType, StripeElements } from '@stripe/stripe-js';

interface CreatePaymentIntentResponse {
    clientSecret: string;
    paymentIntentId: string;
    publishableKey: string;
}

interface PaymentIntentPayload {
    amount: number;
    currency?: string;
    productId?: string;
    buyerEmail?: string;
    shippingAddress?: {
        name: string;
        line1: string;
        line2?: string;
        city: string;
        postalCode: string;
        country: string;
        phone?: string;
    };
    billingAddress?: {
        name: string;
        line1: string;
        line2?: string;
        city: string;
        postalCode: string;
        country: string;
        phone?: string;
    };
}

export const useStripePayment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createPaymentIntent = useCallback(
        async (payload: PaymentIntentPayload): Promise<CreatePaymentIntentResponse | null> => {
            try {
                setLoading(true);
                setError(null);

                const response = await axiosInstance.post<CreatePaymentIntentResponse>(
                    '/payments/intent',
                    payload
                );

                return response.data;
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : 'Erreur lors de la création du paiement';
                setError(errorMessage);
                console.error('Payment intent error:', err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const confirmPayment = useCallback(
        async (
            stripe: StripeType | null,
            elements: StripeElements | null,
            clientSecret: string
        ) => {
            if (!stripe || !elements) {
                setError('Stripe non initialisé');
                return null;
            }

            try {
                setLoading(true);
                setError(null);

                // Submit first (stripe asked)
                const { error: submitError } = await elements.submit();
                if (submitError) {
                    setError(submitError.message || 'Erreur lors de la soumission du formulaire');
                    return null;
                }

                const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
                    elements,
                    clientSecret,
                    redirect: 'if_required',
                });

                if (confirmError) {
                    setError(confirmError.message || 'Erreur lors du paiement');
                    return null;
                }

                return paymentIntent;
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : 'Erreur lors du paiement';
                setError(errorMessage);
                console.error('Payment confirmation error:', err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        createPaymentIntent,
        confirmPayment,
        loading,
        error,
    };
};
