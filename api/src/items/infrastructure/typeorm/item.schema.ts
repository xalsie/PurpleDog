import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    CreateDateColumn,
} from 'typeorm';
import { SaleType, ItemStatus } from '../../domain/entities/item.entity';
import { Media } from '../../../medias/entities/media.entity';

@Entity('items')
export class ItemSchema {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'seller_id', type: 'int', nullable: true })
    sellerId: number | null;

    @Column({ name: 'category_id', type: 'int', nullable: true })
    categoryId: number | null;

    @Column({ length: 255 })
    name: string;

    @Column('text')
    description: string;

    @Column({ name: 'dimensions_cm', type: 'jsonb', nullable: true })
    dimensions_cm: { height: number; width: number; depth: number } | null;

    @Column({
        name: 'weight_kg',
        type: 'numeric',
        precision: 10,
        scale: 3,
        nullable: true,
    })
    weight_kg: string | number | null;

    @Column({
        name: 'desired_price',
        type: 'numeric',
        precision: 12,
        scale: 2,
        nullable: true,
    })
    desired_price: string | number | null;

    @Column({
        name: 'ai_estimated_price',
        type: 'numeric',
        precision: 12,
        scale: 2,
        nullable: true,
    })
    ai_estimated_price: string | number | null;

    @Column({
        name: 'min_price_accepted',
        type: 'numeric',
        precision: 12,
        scale: 2,
        nullable: true,
    })
    min_price_accepted: string | number | null;

    @Column({
        name: 'sale_type',
        type: 'enum',
        enum: SaleType,
        nullable: true,
    })
    sale_type: SaleType | null;

    @Column({
        name: 'status',
        type: 'enum',
        enum: ItemStatus,
        default: ItemStatus.DRAFT,
    })
    status: ItemStatus;

    @OneToMany(() => Media, (m: Media) => m.item, {
        cascade: true,
    })
    medias: Media[];

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;
}
