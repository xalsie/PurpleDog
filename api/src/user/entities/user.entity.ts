import { BaseEntity } from '../../base.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { Profile } from './user-profile.entity';
import { ProfessionalProfile } from './user-professional-profile.entity';
import { RoleEnum } from './role.enum';

@Entity({ name: 'users' })
export class User extends BaseEntity {
    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 100 })
    password: string;

    @Column({ type: 'varchar', length: 50 })
    role: RoleEnum;

    @Column({ type: 'boolean', default: false })
    isVerfied: boolean;

    @Column({ type: 'boolean', default: false })
    IsIdentityVerified: boolean;

    @Column({ type: 'timestamp', nullable: true })
    lastLogin: Date | null;

    @OneToOne(() => Profile, (profile) => profile.user)
    profile: Profile;

    @OneToOne(() => ProfessionalProfile, (pro) => pro.user)
    professionalProfile?: ProfessionalProfile;
}
