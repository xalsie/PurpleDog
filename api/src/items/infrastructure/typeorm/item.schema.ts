import {
    Entity,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
    RelationId,
} from 'typeorm';
import { SaleType, ItemStatus } from '../../domain/entities/item.entity';
import { Media } from '../../../medias/entities/media.entity';
import { BaseEntity } from '../../../base.entity';
import { User } from '../../../user/entities/user.entity';

@Entity('items')
export class ItemSchema extends BaseEntity {
    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'seller_id' })
    seller: User | null;

    @RelationId((item: ItemSchema) => item.seller)
    sellerId: string | null;

    @Column({ name: 'category', type: 'simple-array', nullable: true })
    category: string[];

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
        name: 'starting_price',
        type: 'numeric',
        precision: 12,
        scale: 2,
        nullable: true,
    })
    starting_price: string | number | null;

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

    @Column({ name: 'brand', type: 'varchar', length: 255, nullable: true })
    brand: string | null;

    @Column({ name: 'model', type: 'varchar', length: 255, nullable: true })
    model: string | null;

    @Column({ name: 'material', type: 'varchar', length: 255, nullable: true })
    material: string | null;

    @Column({ name: 'color', type: 'varchar', length: 255, nullable: true })
    color: string | null;

    @Column({ name: 'year', type: 'varchar', length: 32, nullable: true })
    year: string | null;

    @Column({ name: 'condition', type: 'varchar', length: 255, nullable: true })
    condition: string | null;

    @Column({ name: 'authenticated', type: 'boolean', default: false })
    authenticated: boolean;
}
