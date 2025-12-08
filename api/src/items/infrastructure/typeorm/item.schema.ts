import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ItemCategory } from '../../domain/entities/item.entity';

@Entity('items')
export class ItemSchema {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: ItemCategory })
    category: ItemCategory;

    @Column('simple-json')
    dimensions: { height: number; width: number; depth: number };

    @Column('float')
    weight: number;

    @Column()
    description: string;

    @Column('simple-array')
    documents: string[];

    @Column('simple-array')
    photos: string[];

    @Column('float')
    desiredPrice: number;

    @Column()
    saleMode: 'auction' | 'quick-sale';
}
