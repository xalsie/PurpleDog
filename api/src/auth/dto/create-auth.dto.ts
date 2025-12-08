import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@example.com' })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'strongPassword123' })
  readonly password: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ example: false })
  readonly isVerfied: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ example: false })
  readonly IsIdentityVerified: boolean;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  readonly createdAt: Date;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  readonly updatedAt: Date;
}
