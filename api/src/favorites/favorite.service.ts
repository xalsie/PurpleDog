import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Favorite } from './entities/favorite.entity';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { ItemStatus } from '../items/domain/entities/item.entity';

@Injectable()
export class FavoriteService {
    constructor(
        @InjectRepository(Favorite)
        private readonly favRepo: Repository<Favorite>,
    ) {}

    async create(createFavoriteDto: CreateFavoriteDto): Promise<Favorite> {
        const exists = await this.favRepo.findOneBy({
            userId: createFavoriteDto.userId,
            itemId: createFavoriteDto.itemId,
        });
        if (exists) {
            return exists;
        }
        const favorite = this.favRepo.create({
            userId: createFavoriteDto.userId,
            itemId: createFavoriteDto.itemId,
        });
        return this.favRepo.save(favorite);
    }

    async findAll(userId: string, page = 1, pageSize = 20) {
        const [rows, total] = await this.favRepo
            .createQueryBuilder('f')
            .leftJoinAndSelect('f.item', 'i')
            .where('f.userId = :userId', { userId })
            .orderBy('f.createdAt', 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();

        const data = rows.map((r) => ({
            id: r.item.id,
            name: r.item.name,
            status: r.item.status,
            availability:
                r.item.status === ItemStatus.PUBLISHED
                    ? 'en vente'
                    : 'plus disponible',
            favoriteCreatedAt: r.createdAt,
        }));

        return { data, meta: { page, pageSize, total } };
    }

    async findOne(id: string): Promise<Favorite | null> {
        const favorite = await this.favRepo.findOneBy({ id });
        if (!favorite) {
            throw new BadRequestException({
                statusCode: 400,
                code: 'FAVORITE_NOT_FOUND',
                message: 'Favorite not found',
                id,
            });
        }
        return favorite;
    }

    async update(id: string, updateFavoriteDto: UpdateFavoriteDto) {
        const favorite = await this.favRepo.preload({
            id: id,
            ...updateFavoriteDto,
        });
        if (!favorite) {
            throw new BadRequestException({
                statusCode: 400,
                code: 'FAVORITE_NOT_FOUND',
                message: 'Favorite not found',
                id,
            });
        }
        return this.favRepo.save(favorite);
    }

    async remove(id: string) {
        await this.favRepo.delete({ id });
        return { ok: true };
    }
}
