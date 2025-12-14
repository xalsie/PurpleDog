import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    ParseUUIDPipe,
} from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { Auction } from '../bids/entities/auction.entity';
import { AuthGuard } from '../security/auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('auctions')
export class AuctionsController {
    constructor(private readonly auctionsService: AuctionsService) {}

    @UseGuards(AuthGuard)
    @Post()
    create(@Body() createAuctionDto: CreateAuctionDto): Promise<Auction> {
        return this.auctionsService.create(createAuctionDto);
    }

    @Get('item/:itemId')
    findByItemId(
        @Param('itemId', ParseUUIDPipe) itemId: string,
    ): Promise<Auction | null> {
        return this.auctionsService.findByItemId(itemId);
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Auction | null> {
        return this.auctionsService.findOne(id);
    }
}
