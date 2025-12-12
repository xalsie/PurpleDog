import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'payments' })
export class Payment extends BaseEntity {
    @Index()
    @Column({ type: 'uuid' })
    userId: string;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 100 })
    paymentIntentId: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    paymentMethodId: string | null;

    @Column({ type: 'varchar', length: 50 })
    status: string;

    @Column({ type: 'varchar', length: 30, nullable: true })
    captureMethod: string | null;

    @Column({ type: 'varchar', length: 10 })
    currency: string;

    // amount in minor units (cents)
    @Column({ type: 'int' })
    amount: number;

    @Column({ type: 'varchar', length: 150, nullable: true })
    productId: string | null;

    @Column({ type: 'varchar', length: 200, nullable: true })
    buyerEmail: string | null;

    @Column({ type: 'json', nullable: true })
    shippingAddress: Record<string, any> | null;

    @Column({ type: 'json', nullable: true })
    billingAddress: Record<string, any> | null;
}
