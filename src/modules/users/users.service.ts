import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async create(user: Partial<User>): Promise<User> {
    return this.userModel.create(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    if (user) {
      await user.destroy(); // Soft delete because of paranoid: true
    }
  }
}
