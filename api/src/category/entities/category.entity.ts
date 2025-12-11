import { BaseEntity } from '../../base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'categories' })
export class Category extends BaseEntity {
    @Column({ type: 'varchar', length: 100, unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'boolean', default: false })
    isChild: boolean;
}
