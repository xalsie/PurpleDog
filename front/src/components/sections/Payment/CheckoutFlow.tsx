'use client'

import React, { useState } from 'react';
import ShippingAddressForm, { ShippingAddressData } from './ShippingAddressForm';
import BillingAddressForm, { BillingAddressData } from './BillingAddressForm';
import PaymentFormWrapper from './PaymentFormWrapper';
import { useStripePayment } from '@/hooks/useStripePayment';
import { useAuth } from '@/hooks/useAuth';

interface CheckoutFlowProps {
    productId: string;
    productPrice: number;
    productTitle: string;
    onPaymentComplete: () => void;
    onClose: () => void;
}

type CheckoutStep = 'shipping' | 'billing' | 'payment' | 'success';

export default function CheckoutFlow({
    productId,
    productPrice,
    productTitle,
    onPaymentComplete,
    onClose,
}: CheckoutFlowProps) {
    const { user } = useAuth();
    const { createPaymentIntent, loading: paymentLoading } = useStripePayment();
    const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
    const [shippingAddress, setShippingAddress] = useState<ShippingAddressData | null>(null);
    const [billingAddress, setBillingAddress] = useState<BillingAddressData | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleShippingSubmit = (data: ShippingAddressData) => {
        setShippingAddress(data);
        setError(null);
        setCurrentStep('billing');
    };

    const handleBillingSubmit = async (data: BillingAddressData) => {
        try {
            setBillingAddress(data);
            setError(null);

            // Create payment intent
            const response = await createPaymentIntent({
                amount: productPrice,
                currency: 'eur',
                productId,
                buyerEmail: user?.email,
                shippingAddress: shippingAddress || undefined,
                billingAddress: data,
            });

            if (response) {
                setClientSecret(response.clientSecret);
                setCurrentStep('payment');
            } else {
                setError('Erreur lors de la création du paiement');
            }
        } catch (err) {
            setError('Erreur lors de la création du paiement');
            console.error('Billing submit error:', err);
        }
    };

    const handlePaymentSuccess = () => {
        setCurrentStep('success');
        onPaymentComplete();
    };

    const handlePaymentError = (errorMessage: string) => {
        setError(errorMessage);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
                {/* Header */}
                <div className="sticky top-0 bg-purple-600 text-white p-6 flex items-center justify-between border-b border-purple-600/10">
                    <div>
                        <h2 className="text-xl font-semibold">Checkout</h2>
                        <p className="text-sm text-white/80 mt-1">{productTitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-white/80 transition"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Progress indicator */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        {(['shipping', 'billing', 'payment'] as const).map((step, index) => (
                            <React.Fragment key={step}>
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition ${
                                            currentStep === step || ['shipping', 'billing', 'payment'].indexOf(currentStep) > index
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-200 text-gray-600'
                                        }`}
                                    >
                                        {index + 1}
                                    </div>
                                    <p className="text-xs mt-1 capitalize text-gray-600">
                                        {step === 'shipping' && 'Livraison'}
                                        {step === 'billing' && 'Facturation'}
                                        {step === 'payment' && 'Paiement'}
                                    </p>
                                </div>
                                {index < 2 && (
                                    <div
                                        className={`flex-1 h-1 mx-4 rounded transition ${
                                            ['shipping', 'billing', 'payment'].indexOf(currentStep) > index
                                                ? 'bg-purple-600'
                                                : 'bg-gray-200'
                                        }`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {currentStep === 'shipping' && (
                        <ShippingAddressForm
                            onSubmit={handleShippingSubmit}
                            loading={paymentLoading}
                        />
                    )}

                    {currentStep === 'billing' && shippingAddress && (
                        <BillingAddressForm
                            shippingAddress={shippingAddress}
                            onSubmit={handleBillingSubmit}
                            loading={paymentLoading}
                        />
                    )}

                    {currentStep === 'payment' && clientSecret && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Informations de paiement
                            </h3>
                            <div className="mb-6 p-4 bg-blue-50 rounded">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm text-gray-600">Montant</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {(productPrice).toLocaleString('fr-FR', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        })}
                                    </p>
                                </div>
                                <p className="text-xs text-gray-600">
                                    Les fonds seront bloqués jusqu'à la confirmation de la livraison
                                </p>
                            </div>

                            <PaymentFormWrapper
                                clientSecret={clientSecret}
                                onSuccess={handlePaymentSuccess}
                                onError={handlePaymentError}
                                loading={paymentLoading}
                            />
                        </div>
                    )}

                    {currentStep === 'success' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Paiement confirmé !
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Votre commande a été validée. Vous allez recevoir un email de
                                confirmation.
                            </p>
                            <button
                                onClick={onClose}
                                className="bg-purple-600 text-white px-6 py-2 rounded font-medium hover:bg-purple-700 transition"
                            >
                                Fermer
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
