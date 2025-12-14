import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';
import { SecurityModule } from '../security';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([Payment, User]),
        SecurityModule,
    ],
    controllers: [PaymentsController],
    providers: [
        {
            provide: 'STRIPE_CLIENT',
            useFactory: (configService: ConfigService) => {
                const secretKey =
                    configService.get<string>('STRIPE_SECRET_KEY');
                if (!secretKey) {
                    throw new Error('STRIPE_SECRET_KEY is not configured');
                }
                return new Stripe(secretKey, {
                    apiVersion: '2025-02-24.acacia',
                });
            },
            inject: [ConfigService],
        },
        PaymentsService,
    ],
    exports: [PaymentsService],
})
export class PaymentsModule {}
