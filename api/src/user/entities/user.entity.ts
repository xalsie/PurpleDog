import { BaseEntity } from 'src/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ type: 'text', length: 100, unique: true })
  email: string;

  @Column({ type: 'text', length: 100 })
  password: string;

  @Column({ type: 'boolean', default: false })
  isVerfied: boolean;

  @Column({ type: 'boolean', default: false })
  IsIdentityVerified: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
