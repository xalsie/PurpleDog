import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ItemSchema } from '../../items/infrastructure/typeorm/item.schema';

@Entity('quick_offers')
export class QuickOffer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
