import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { ItemSchema } from '../../items/infrastructure/typeorm/item.schema';

@Entity('bids')
export class Bid {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column({ name: 'item_id', type: 'uuid' })
    itemId: string;

    @ManyToOne(() => ItemSchema, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'item_id' })
    item: ItemSchema;

    @Column({ type: 'numeric', precision: 12, scale: 2 })
    amount: string | number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
