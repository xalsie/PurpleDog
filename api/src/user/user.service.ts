import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { SaveAddressDto } from './dto/save-address.dto';
import { User } from './entities/user.entity';
import { Profile } from './entities/user-profile.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
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
        return foundUser;
    }

    async saveAddress(
        userId: string,
        dto: SaveAddressDto,
        type: 'shipping' | 'billing',
    ): Promise<any> {
        const profile = await this.profileRepository.findOne({
            where: { userId },
        });

        if (!profile) {
            throw new Error('Profile not found');
        }

        // Only save shipping address to profile
        if (type === 'shipping') {
            profile.addressLine1 = dto.line1;
            profile.addressZip = dto.postalCode;
            profile.addressCity = dto.city;
            profile.addressCountry = dto.country;
        }

        const savedProfile = await this.profileRepository.save(profile);
        return {
            type,
            ...dto,
        };
    }

    async getAddresses(userId: string): Promise<any> {
        const profile = await this.profileRepository.findOne({
            where: { userId },
        });

        if (!profile) {
            return { error: 'No profile found' };
        }

        const addresses: any[] = [];
        if (profile.addressLine1) {
            addresses.push({
                type: 'shipping',
                name: profile.firstName + ' ' + profile.lastName,
                line1: profile.addressLine1,
                city: profile.addressCity,
                postalCode: profile.addressZip,
                country: profile.addressCountry,
            });
        }

        return addresses.length > 0
            ? addresses
            : { debug: 'No addresses found' };
    }
}
