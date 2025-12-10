import { IsBoolean, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class UpdateAuthDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  readonly email: string;

  @IsString()
  @ApiProperty({ example: 'strongPassword123' })
  readonly password: string;

  @IsBoolean()
  @ApiProperty({ example: false })
  readonly isVerfied: boolean;

  @IsBoolean()
  @ApiProperty({ example: false })
  readonly IsIdentityVerified: boolean;
}
