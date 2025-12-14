import {
    Controller,
    Post,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { AuthGuard } from '../security/auth.guard';

@Controller('bids')
export class BidsController {
    constructor(private readonly bidsService: BidsService) {}

    @UseGuards(AuthGuard)
    @Post()
    create(@Body() createBidDto: CreateBidDto, @Request() req) {
        const bidderId = req.user.id;
        return this.bidsService.create(createBidDto, bidderId);
    }
}
