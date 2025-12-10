import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { QuickOfferService } from './quick-offer.service';
import { CreateQuickOfferDto } from './dto/create-quick-offer.dto';
import { UpdateQuickOfferDto } from './dto/update-quick-offer.dto';

@Controller('quick-offer')
export class QuickOfferController {
    constructor(private readonly quickOfferService: QuickOfferService) {}

    @Post()
    create(@Body() createQuickOfferDto: CreateQuickOfferDto) {
        return this.quickOfferService.create(createQuickOfferDto);
    }

    @Get()
    findAll() {
        return this.quickOfferService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.quickOfferService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateQuickOfferDto: UpdateQuickOfferDto,
    ) {
        return this.quickOfferService.update(id, updateQuickOfferDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.quickOfferService.remove(id);
    }
}
