import {
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
    private readonly logger = new Logger(PaymentsService.name);

    constructor(
        @Inject('STRIPE_CLIENT') private readonly stripe: Stripe,
        private readonly configService: ConfigService,
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
    ) {}

    async createPaymentIntent(payload: CreatePaymentIntentDto, userId: string) {
        const {
            amount,
            currency = 'eur',
            productId,
            buyerEmail,
            shippingAddress,
            billingAddress,
        } = payload;

        const amountInMinorUnit = Math.round(amount * 100);

        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: amountInMinorUnit,
                currency,
                capture_method: 'manual',
                automatic_payment_methods: { enabled: true },
                receipt_email: buyerEmail,
                metadata: {
                    productId: productId ?? '',
                    buyerEmail: buyerEmail ?? '',
                    shippingCity: shippingAddress?.city ?? '',
                    billingCity: billingAddress?.city ?? '',
                },
                shipping: shippingAddress
                    ? {
                          name: shippingAddress.name,
                          phone: shippingAddress.phone,
                          address: {
                              line1: shippingAddress.line1,
                              line2: shippingAddress.line2,
                              city: shippingAddress.city,
                              postal_code: shippingAddress.postalCode,
                              country: shippingAddress.country,
                          },
                      }
                    : undefined,
            });

            if (!paymentIntent.client_secret) {
                throw new InternalServerErrorException(
                    'Stripe client secret missing',
                );
            }

            const payment = this.paymentRepository.create({
                userId,
                paymentIntentId: paymentIntent.id,
                paymentMethodId: paymentIntent.payment_method as string | null,
                amount: amountInMinorUnit,
                currency,
                status: paymentIntent.status,
                captureMethod: paymentIntent.capture_method ?? null,
                productId: productId ?? null,
                buyerEmail: buyerEmail ?? null,
                shippingAddress: shippingAddress ?? null,
                billingAddress: billingAddress ?? null,
            });

            await this.paymentRepository.save(payment);

            return {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                publishableKey: this.configService.get<string>(
                    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
                ),
            };
        } catch (error) {
            this.logger.error(
                'Stripe PaymentIntent creation failed',
                error as Error,
            );
            throw new InternalServerErrorException(
                'Unable to initiate payment',
            );
        }
    }
}
