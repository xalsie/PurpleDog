import {
    Controller,
    Get,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SaveAddressDto } from './dto/save-address.dto';
import { Roles } from './roles.decorator';
import { AuthGuard } from '../security/auth.guard';
import { RolesGuard } from '../security/roles.guard';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { CurrentUser } from './current-user.decorator';
import { User } from './entities';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('all')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Invalid establishment ID' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Establishment not found' })
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ status: 200, description: 'User retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Invalid user ID' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'User not found' })
    findOne(@CurrentUser() user: User, @Param('id') id: string) {
        return this.userService.findOne(user, id);
    }

    @Patch(':id')
    update(
        @CurrentUser() user: User,
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.userService.update(user, id, updateUserDto);
    }

    @Delete(':id')
    remove(@CurrentUser() user: User, @Param('id') id: string) {
        return this.userService.remove(user, id);
    }

    @Post('addresses/shipping')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Save shipping address' })
    @ApiResponse({
        status: 201,
        description: 'Shipping address saved successfully',
    })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async saveShippingAddress(
        @Body() dto: SaveAddressDto,
        @CurrentUser() user: User,
    ) {
        const result = await this.userService.saveAddress(
            user.id,
            dto,
            'shipping',
        );
        return result;
    }

    @Post('addresses/billing')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Save billing address' })
    @ApiResponse({
        status: 201,
        description: 'Billing address saved successfully',
    })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async saveBillingAddress(
        @Body() dto: SaveAddressDto,
        @CurrentUser() user: User,
    ) {
        const result = await this.userService.saveAddress(
            user.id,
            dto,
            'billing',
        );
        return result;
    }

    @Get('addresses')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get all addresses for current user' })
    @ApiResponse({
        status: 200,
        description: 'Addresses retrieved successfully',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getAddresses(@CurrentUser() user: User) {
        try {
            const result = await this.userService.getAddresses(user.id);
            return result;
        } catch (error) {
            console.error('[UserController] Error in getAddresses:', error);
            throw error;
        }
    }
}
