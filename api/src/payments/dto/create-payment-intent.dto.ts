import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsPositive,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
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

export class CreatePaymentIntentDto {
    @IsNumber()
    @IsPositive()
    amount: number;

    @IsString()
    @IsOptional()
    currency = 'eur';

    @IsString()
    @IsOptional()
    productId?: string;

    @IsEmail()
    @IsOptional()
    buyerEmail?: string;

    @ValidateNested()
    @Type(() => AddressDto)
    @IsOptional()
    shippingAddress?: AddressDto;

    @ValidateNested()
    @Type(() => AddressDto)
    @IsOptional()
    billingAddress?: AddressDto;
}
