import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ItemSchema } from '../../items/infrastructure/typeorm/item.schema';
import { BaseEntity } from '../../base.entity';

@Entity('quick_offers')
export class QuickOffer extends BaseEntity {
    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column({ name: 'item_id', type: 'uuid' })
    itemId: string;

    @ManyToOne(() => ItemSchema, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'item_id' })
    item: ItemSchema;

    @Column({ name: 'offer_price', type: 'numeric', precision: 12, scale: 2 })
    offerPrice: string | number;

    @Column({ type: 'varchar', length: 20, default: 'PENDING' })
    status: string;
}
