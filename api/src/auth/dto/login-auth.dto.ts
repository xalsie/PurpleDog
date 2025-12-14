import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'example@yopmail.com' })
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'strongPassword123' })
    readonly password: string;
}
