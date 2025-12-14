import {
    IsString,
    IsNumber,
    IsDate,
    IsOptional,
    IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AuctionStatus } from '../../bids/entities/auction.entity';

export class CreateAuctionDto {
    @IsString()
    itemId: string;

    @IsDate()
    @Type(() => Date)
    startTime: Date;

    @IsDate()
    @Type(() => Date)
    endTime: Date;

    @IsNumber()
    startingPrice: number;

    @IsOptional()
    @IsNumber()
    reservePrice?: number;
}
