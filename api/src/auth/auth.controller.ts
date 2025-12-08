import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { type Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler/dist/throttler.guard';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid user data' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async register(@Body() createAuthDto: CreateAuthDto, @Res() res: Response) {
    try {
      const result = await this.authService.create(createAuthDto);
      if (result instanceof Error) {
        if (
          result.message === 'Invalid email format' ||
          result.message === 'Invalid password format' ||
          result.message === 'Invalid role format'
        ) {
          return res.status(400).send({ error: result.message });
        }
        if (
          result.message === 'Email already in use' ||
          result.message === 'Establishment name already in use'
        ) {
          return res.status(409).send({ error: result.message });
        }
        return res.status(500).send({ error: result.message });
      }
      return res.status(201).send(result);
    } catch (error) {
      console.error('Error in adminRegister:', error);
      return res
        .status(500)
        .send({ error: error.message || 'Internal server error' });
    }
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
