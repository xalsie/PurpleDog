import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Unique,
} from 'typeorm';
import { ItemSchema } from '../../items/infrastructure/typeorm/item.schema';
import { BaseEntity } from '../../base.entity';

@Entity('favorites')
@Unique(['userId', 'itemId'])
export class Favorite extends BaseEntity {
    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column({ name: 'item_id', type: 'uuid' })
    itemId: string;

    @ManyToOne(() => ItemSchema, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'item_id' })
    item: ItemSchema;
}
