import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Favorite } from './entities/favorite.entity';
import { Profile } from '../user/entities/user-profile.entity';

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
            .leftJoinAndSelect('i.medias', 'm')
            .where('f.userId = :userId', { userId })
            .orderBy('f.createDateTime', 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();

        const sellerIds = Array.from(
            new Set(rows.map((r) => r.item?.sellerId).filter((s) => s != null)),
        );
        const sellerNameMap: Record<string | number, string | null> = {};
        if (sellerIds.length > 0) {
            const profileRepo = this.favRepo.manager.getRepository(Profile);
            const profiles = await Promise.all(
                sellerIds.map(async (sid) => {
                    try {
                        const profile = await profileRepo.findOne({
                            where: { userId: String(sid) } as any,
                            select: { firstName: true, lastName: true },
                        });
                        let name: string | null = null;
                        if (profile) {
                            name = profile.firstName + ' ' + profile.lastName;
                        }
                        return { sid, name };
                    } catch {
                        return { sid, name: null };
                    }
                }),
            );
            for (const p of profiles) {
                sellerNameMap[p.sid] = p.name;
            }
        }

        const data = rows.map((r) => {
            const sellerName = r.item.sellerId
                ? (sellerNameMap[r.item.sellerId] ?? null)
                : null;
            return {
                id: r.item.id,
                name: r.item.name,
                status: r.item.status,
                price: r.item.desired_price,
                availability:
                    r.item.status === ItemStatus.PUBLISHED
                        ? 'en vente'
                        : 'plus disponible',
                favoriteCreatedAt: r.createDateTime,
                medias: (r.item.medias || []).map((m) => ({
                    id: m.id,
                    url: m.url,
                    mediaType: m.mediaType,
                    isPrimary: m.isPrimary,
                })),
                sellerId: r.item.sellerId,
                sellerName,
            };
        });

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
