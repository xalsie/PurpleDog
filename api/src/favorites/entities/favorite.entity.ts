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

@Entity('favorites')
@Unique(['userId', 'itemId'])
export class Favorite {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // @Column({ name: 'user_id', type: 'uuid' })
    @Column('text')
    userId: string;

    @Column({ name: 'item_id', type: 'uuid' })
    itemId: string;

    @ManyToOne(() => ItemSchema, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'item_id' })
    item: ItemSchema;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
