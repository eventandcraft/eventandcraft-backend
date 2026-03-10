import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

// Extend Express Request to include our custom user payload
interface AuthenticatedRequest extends ExpressRequest {
  user: {
    userId: string;
    sub?: string;
    email?: string;
    phoneNumber?: string;
  };
}

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: AuthenticatedRequest) {
    // sub is used in JwtAuthGuard, userId is used in JwtStrategy
    const userId = req.user.sub || req.user.userId;
    if (!userId) {
      throw new NotFoundException('User ID not found in token');
    }
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get()
  async findAll(@Query() query: Partial<User>) {
    if (query.id) {
      const user = await this.usersService.findOne(query.id);
      if (!user) throw new NotFoundException('User not found');
      return user;
    }
    return this.usersService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Post()
  create(@Body() user: Partial<User>) {
    return this.usersService.create(user);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<User>) {
    const updatedUser = await this.usersService.update(id, updateData);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
