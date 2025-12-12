import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class SaveAddressDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    line1: string;

    @IsString()
    @IsOptional()
    line2?: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    postalCode: string;

    @IsString()
    @IsNotEmpty()
    country: string;

    @IsString()
    @IsOptional()
    phone?: string;
}
