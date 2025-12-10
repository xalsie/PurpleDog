import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Res,
} from '@nestjs/common';
import { type Response } from 'express';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler/dist/throttler.guard';
import { CurrentUser, User } from '../user';
import { RegisterUserDto } from './dto';
import { AuthGuard } from '../security/auth.guard';
import { LoginDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/check-email/:email')
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Check if email exists and return user type' })
  @ApiResponse({ status: 200, description: 'Email check result' })
  @ApiResponse({ status: 400, description: 'Email invalid' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async checkEmail(@Param('email') email: string) {
    const result = await this.authService.checkEmail(email);
    return result;
  }

  @Post()
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid user data' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async register(@Body() registerUserDto: RegisterUserDto, @Res() res: Response) {
    try {
      const result = await this.authService.registerUser(registerUserDto);
      if (result instanceof Error) {
        if (
          result.message === 'Invalid email' ||
          result.message === 'Invalid password' ||
          result.message === 'Invalid role'
        ) {
          return res.status(400).send({ error: result.message });
        }
        if (
          result.message === 'Already exists'
        ) {
          return res.status(409).send({ error: result.message });
        }
        return res.status(500).send({ error: result.message });
      }
      return res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error in adminRegister:', error);
      return res
        .status(500)
        .send({ error: error.message || 'Internal server error' });
    }
  }

  @Post('/login')
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User login successfully' })
  @ApiResponse({ status: 400, description: 'Invalid user data' })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    if (result instanceof Error) {
      return { error: result.message };
    }
    return result;
  }

  @ApiBearerAuth()
  @Get('/me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Current user retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async me(@CurrentUser() user: User) {
    return this.authService.me(user);
  }

  @Get('/forgot/:email')
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Initiate password reset process' })
  @ApiResponse({ status: 200, description: 'Password reset initiated' })
  @ApiResponse({ status: 400, description: 'Invalid email address' })
  async forgot(@Param('email') email: string) {
    return await this.authService.forgot(email);
  }

  @Get('/reset/:token/:newPassword')
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid token or password' })
  async reset(@Param('token') token: string, @Param('newPassword') newPassword: string) {
    return await this.authService.reset(token, newPassword);
  }

  @ApiBearerAuth()
  @Get('/refresh')
  @UseGuards(ThrottlerGuard, AuthGuard)
  @ApiOperation({ summary: 'Refresh authentication token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid refresh token' })
  async refreshToken(@CurrentUser() user: User) {
    return await this.authService.refreshToken(user);
  }

  // @Get('/otp')
  // @UseGuards(ThrottlerGuard)
  // @ApiOperation({ summary: 'Handle OTP operations' })
  // @ApiResponse({ status: 200, description: 'OTP processed successfully' })
  // @ApiResponse({ status: 400, description: 'Invalid OTP data' })
  // async otp() {
  //   return await this.authService.otp();
  // }
}
