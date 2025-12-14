'use client'

import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { Stripe as StripeType, StripeElementsOptions } from '@stripe/stripe-js';
import { Button } from '@/components/ui';

interface PaymentFormWrapperProps {
    clientSecret: string;
    onSuccess: () => void;
    onError: (error: string) => void;
    loading?: boolean;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function PaymentFormContent({
    clientSecret,
    onSuccess,
    onError,
    loading: externalLoading,
}: Omit<PaymentFormWrapperProps, 'clientSecret'> & { clientSecret: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setErrorMessage('Stripe not initialized');
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        try {
            // Submit Elements first (required by Stripe deferred flow)
            const { error: submitError } = await elements.submit();
            if (submitError) {
                const msg = submitError.message || 'Erreur lors de la soumission du formulaire';
                setErrorMessage(msg);
                onError(msg);
                return;
            }

            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                clientSecret,
                redirect: 'if_required',
            });

            if (error) {
                setErrorMessage(error.message || 'Payment failed');
                onError(error.message || 'Payment failed');
            } else if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'requires_capture') {
                onSuccess();
            } else if (paymentIntent.status === 'requires_action') {
                // 3D Secure or other authentication needed
                setErrorMessage('Additional authentication required');
                onError('Additional authentication required');
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setErrorMessage(message);
            onError(message);
        } finally {
            setLoading(false);
        }
    };

    const isLoading = loading || externalLoading;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-purple-light/10 p-6 rounded">
                <PaymentElement />
            </div>

            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                    {errorMessage}
                </div>
            )}

            <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading || !stripe || !elements}
                className="w-full uppercase tracking-widest"
            >
                {isLoading ? 'Traitement du paiement...' : 'Payer maintenant'}
            </Button>

            <p className="text-xs text-purple-dark/60 text-center">
                Votre paiement est sécurisé via Stripe. Les fonds seront bloqués jusqu'à la
                confirmation de la livraison.
            </p>
        </form>
    );
}

export default function PaymentFormWrapper({
    clientSecret,
    onSuccess,
    onError,
    loading,
}: PaymentFormWrapperProps) {
    const [stripeLoaded, setStripeLoaded] = useState(false);

    useEffect(() => {
        stripePromise.then(() => {
            setStripeLoaded(true);
        });
    }, []);

    if (!stripeLoaded) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-purple-dark">Chargement du formulaire de paiement...</p>
            </div>
        );
    }

    const options: StripeElementsOptions = {
        clientSecret,
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#6B3E8A',
                colorBackground: '#FAFAF8',
                fontFamily: '"Raleway", sans-serif',
            },
        },
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <PaymentFormContent
                clientSecret={clientSecret}
                onSuccess={onSuccess}
                onError={onError}
                loading={loading}
            />
        </Elements>
    );
}
