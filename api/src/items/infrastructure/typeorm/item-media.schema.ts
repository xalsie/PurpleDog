import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ItemSchema } from './item.schema';
import { MediaType } from '../../domain/entities/media.type';

@Entity('item_media')
export class ItemMediaSchema {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ItemSchema, (item) => item.medias, { onDelete: 'CASCADE' })
    item: ItemSchema;

    @Column('text')
    url: string;

    @Column({ type: 'enum', enum: MediaType })
    type: MediaType;

    @Column({ name: 'is_primary', type: 'boolean', default: false })
    isPrimary: boolean;
}
