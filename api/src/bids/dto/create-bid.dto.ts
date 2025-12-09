import { IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBidDto {
    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsString()
    itemId: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    amount: number;
}
