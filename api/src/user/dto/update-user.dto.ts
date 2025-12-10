import { IsEmail, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from '../entities/role.enum';

export class UpdateUserDto {
    @IsEmail()
    @ApiProperty({ example: 'example@yopmail.com' })
    readonly email?: string;

    @IsString()
    @ApiProperty({
        example: 'strongPassword123',
    })
    readonly password?: string;

    @IsEnum(['SELLER', 'PROFESSIONNAL', 'ADMIN'], {
        message: 'Not authorized role type',
    })
    @ApiProperty({ example: 'PROFESSIONNAL' })
    readonly role?: RoleEnum;
}