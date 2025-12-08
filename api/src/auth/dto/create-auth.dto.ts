export class CreateAuthDto {
  readonly email: string;
  readonly password: string;
  readonly isVerfied: boolean;
  readonly IsIdentityVerified: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
