import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    Matches,
    MinLength,
} from 'class-validator';
import { RoleEnum } from '../../user/entities/role.enum';

export class RegisterUserDto {
    @IsEnum(RoleEnum)
    @ApiProperty({ enum: RoleEnum })
    role: RoleEnum;

    @IsEmail()
    @ApiProperty()
    email: string;

    @IsString()
    @MinLength(8)
    @ApiProperty({ minLength: 8 })
    password: string;

    @IsString()
    @ApiProperty()
    firstName: string;

    @IsString()
    @ApiProperty()
    lastName: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    address?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    profilePhoto?: string | null;

    @IsOptional()
    @IsBoolean()
    @ApiPropertyOptional()
    ageConfirmed?: boolean;

    @IsString()
    @Matches(/^\d{2}\/\d{2}\/\d{4}$/u, {
        message: 'La date doit être au format JJ/MM/AAAA',
    })
    @ApiProperty({
        description: 'Date de naissance au format JJ/MM/AAAA',
        example: '31/12/1990',
    })
    birthDate: string;

    @IsOptional()
    @IsBoolean()
    @ApiPropertyOptional()
    newsletter?: boolean;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    companyName?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    siret?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ description: 'Numéro de TVA' })
    vat?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    website?: string;

    @IsOptional()
    @IsArray()
    @ApiPropertyOptional({ type: [String] })
    specialties?: string[];

    @IsOptional()
    @IsArray()
    @ApiPropertyOptional({ type: [String] })
    researchItems?: string[];

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    socialLinks?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    officialDoc?: string;
}
