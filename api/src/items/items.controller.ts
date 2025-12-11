import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ItemsService } from './application/items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@ApiTags('items')
@Controller('items')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}

    @Post()
    create(@Body() dto: CreateItemDto) {
        return this.itemsService.create(dto);
    }

    @Get()
    findAll() {
        return this.itemsService.findAll();
    }

    @Get('top-favorited')
    findTopFavorited() {
        return this.itemsService.findTopFavorited(10);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.itemsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateItemDto) {
        return this.itemsService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.itemsService.remove(id);
    }
}
