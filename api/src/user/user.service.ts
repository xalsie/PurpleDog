import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(user: User, id: string): Promise<User | Error> {
        if (user.id !== id && user.role !== 'admin') {
            return new Error('Unauthorized');
        }
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
