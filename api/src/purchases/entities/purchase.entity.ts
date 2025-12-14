import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { ItemSchema } from '../../items/infrastructure/typeorm/item.schema';
import { BaseEntity } from '../../base.entity';

@Entity('purchases')
export class Purchase extends BaseEntity {
    @Column({ name: 'buyer_id', type: 'uuid' })
    buyerId: string;

    @Column({ name: 'item_id', type: 'uuid' })
    itemId: string;

    @ManyToOne(() => ItemSchema, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'item_id' })
    item: ItemSchema;

    @Column({ name: 'price', type: 'numeric', precision: 12, scale: 2 })
    price: string | number;

    @CreateDateColumn({ name: 'purchased_at' })
    purchasedAt: Date;
}
