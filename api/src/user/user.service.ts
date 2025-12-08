import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User | Error> {
    try {
      const foundUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (foundUser) {
        return new Error('Already exists');
      }
    } catch (error) {
      return new Error('Error checking for existing user: ' + error);
    }
    try {
      const newUser = this.userRepository.create(createUserDto);
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      return new Error('Error creating user: ' + error);
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User | Error> {
    const foundUser = await this.userRepository.findOne({ where: { id } });
    if (!foundUser) {
      return new Error('User not found');
    }
    return foundUser;
  }

  async update(
    user: User,
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | Error> {
    if (user.id !== id && user.role !== 'admin') {
      return new Error('Unauthorized');
    }
    const updatedUser = this.userRepository.merge(user, updateUserDto);
    const savedUser = await this.userRepository.save(updatedUser);
    if (!savedUser) {
      return new Error('Error updating user');
    }
    return updatedUser;
  }

  async remove(user: User, id: string) {
    if (user.id !== id && user.role !== 'admin') {
      return new Error('Unauthorized');
    }

    const foundUser = await this.userRepository.findOne({ where: { id } });
    if (!foundUser) {
      return new Error('User not found');
    }
    await this.userRepository.delete({ id });

    return;
  }
}
