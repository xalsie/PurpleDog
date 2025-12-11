import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Sse,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';

@Controller('bids')
export class BidsController {
    constructor(private readonly bidsService: BidsService) {}

    @Sse('stream/:itemId')
    stream(@Param('itemId') itemId: string): Observable<any> {
        return this.bidsService.getBidStream(itemId);
    }

    @Post()
    create(@Body() createBidDto: CreateBidDto) {
        return this.bidsService.create(createBidDto);
    }

    @Get(':userId')
    findAll(@Query('userId') userId: string) {
        return this.bidsService.findAll(userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bidsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBidDto: UpdateBidDto) {
        return this.bidsService.update(id, updateBidDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bidsService.remove(id);
    }
}
