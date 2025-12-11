import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ItemSchema } from '../../items/infrastructure/typeorm/item.schema';
import { BaseEntity } from '../../base.entity';

@Entity('bids')
export class Bid extends BaseEntity {
    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column({ name: 'item_id', type: 'uuid' })
    itemId: string;

    @ManyToOne(() => ItemSchema, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'item_id' })
    item: ItemSchema;

    @Column({ type: 'numeric', precision: 12, scale: 2 })
    amount: string | number;
}
