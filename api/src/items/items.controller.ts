import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { ItemsService } from './application/items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { AuthGuard } from '../security/auth.guard';
import { CurrentUser, User } from '../user';
import { ResearchItemDto } from './dto/research-item.dto';

@ApiBearerAuth()
@ApiTags('items')
@Controller('items')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post()
    @ApiOperation({ summary: 'Create item' })
    @ApiResponse({ status: 201, description: 'Item created' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    create(@Body() dto: CreateItemDto, @CurrentUser() user: User) {
        return this.itemsService.create({ ...dto, sellerId: user.id });
    }

    @Post('filter')
    search(@Body() dto: ResearchItemDto) {
        return this.itemsService.search(dto);
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
