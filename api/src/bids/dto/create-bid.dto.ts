import { IsNumber, IsString, Min, IsOptional } from 'class-validator';

export class CreateBidDto {
    @IsString()
    auctionId: string;

    @IsNumber()
    @Min(0)
    amount: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    maxAmount?: number;
}
