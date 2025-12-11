import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto';
import { AuthGuard } from '../security/auth.guard';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Create a new category' })
    @ApiResponse({
        status: 201,
        description: 'Category created successfully',
    })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @Get()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get all categories' })
    @ApiResponse({
        status: 200,
        description: 'Categories retrieved successfully',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findAll() {
        return this.categoryService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get category by ID' })
    @ApiResponse({
        status: 200,
        description: 'Category retrieved successfully',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
    }
}
