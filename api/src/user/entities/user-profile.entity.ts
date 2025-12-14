import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'profiles' })
export class Profile extends BaseEntity {
    @Column({ name: 'user_id', type: 'uuid', unique: true })
    userId: string;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'varchar', length: 100 })
    firstName: string;

    @Column({ type: 'varchar', length: 100 })
    lastName: string;

    @Column({ type: 'text', nullable: true })
    photoUrl?: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    addressLine1?: string | null;

    @Column({ type: 'varchar', length: 20, nullable: true })
    addressZip?: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    addressCity?: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    addressCountry?: string | null;

    @Column({ type: 'date' })
    birthDate: Date;

    @Column({ type: 'boolean', default: false })
    isAdultCertified: boolean;
}
