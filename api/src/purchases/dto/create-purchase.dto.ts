import { IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePurchaseDto {
    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsString()
    itemId: string;

    @ApiProperty()
    @IsString()
    buyerId: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    price: number;
}
