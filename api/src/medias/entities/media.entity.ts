import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { ItemSchema } from '../../items/infrastructure/typeorm/item.schema';
import { MediaType } from '../../items/domain/entities/media.type';

@Entity('media')
export class Media {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'item_id', type: 'uuid', nullable: true })
    itemId: string;

    @Column({ name: 'user_id', type: 'uuid', nullable: true })
    userId: string;

    @ManyToOne(() => ItemSchema, (item) => item.medias, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'item_id' })
    item: ItemSchema;

    @Column('text')
    url: string;

    @Column({
        type: 'enum',
        enum: MediaType,
        name: 'media_type',
    })
    mediaType: MediaType;

    @Column({ name: 'is_primary', type: 'boolean', default: false })
    isPrimary: boolean;
}
