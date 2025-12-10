import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';

@Controller('favorite')
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) {}

    @Post()
    create(@Body() createFavoriteDto: CreateFavoriteDto) {
        return this.favoriteService.create(createFavoriteDto);
    }

    @Get()
    findAll(
        @Query('userId') userId: string,
        @Query('page') page = '1',
        @Query('pageSize') pageSize = '20',
    ) {
        return this.favoriteService.findAll(
            userId,
            parseInt(page, 10),
            parseInt(pageSize, 10),
        );
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.favoriteService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateFavoriteDto: UpdateFavoriteDto,
    ) {
        return this.favoriteService.update(id, updateFavoriteDto);
    }

    @Delete(':id')
    remove(@Param('itemId') itemId: string) {
        return this.favoriteService.remove(itemId);
    }
}
