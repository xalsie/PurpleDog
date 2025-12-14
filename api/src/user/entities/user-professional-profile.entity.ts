import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'profiles_professional' })
export class ProfessionalProfile extends BaseEntity {
    @Column({ name: 'user_id', type: 'uuid', unique: true })
    userId: string;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'varchar', length: 255 })
    companyName: string;

    @Column({ type: 'varchar', length: 50 })
    siretNumber: string;

    @Column({ type: 'varchar', length: 50 })
    vat: string;

    @Column({ type: 'text', nullable: true })
    kbisDocumentUrl: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    websiteUrl: string | null;

    @Column({ type: 'simple-array', nullable: true })
    specialties: string[];

    @Column({ type: 'simple-array', nullable: true })
    interests: string[];

    @Column({ type: 'varchar', length: 50, default: 'TRIAL' })
    subscriptionStatus: string;

    @Column({ type: 'timestamp', nullable: true })
    subscriptionEndDate: Date | null;
}
