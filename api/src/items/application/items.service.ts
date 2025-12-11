import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Item, ItemMedia } from '../domain/entities/item.entity';
import { ITEM_REPOSITORY } from '../domain/item.repository';
import type { ItemRepository } from '../domain/item.repository';
import { CreateItemDto } from '../dto/create-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemSchema } from '../infrastructure/typeorm/item.schema';
import { MediaType } from '../domain/entities/media.type';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { Media } from '../../medias/entities/media.entity';
import { MediasService } from '../../medias/medias.service';
import { ResearchItemDto } from '../dto/research-item.dto';

@Injectable()
export class ItemsService {
    constructor(
        @Inject(ITEM_REPOSITORY)
        private readonly itemRepository: ItemRepository,
        @InjectRepository(ItemSchema)
        private readonly itemRepo: Repository<ItemSchema>,
        @InjectRepository(Favorite)
        private readonly favRepo: Repository<Favorite>,
        private readonly mediasService: MediasService,
    ) {}

    async create(dto: CreateItemDto): Promise<Item> {
        const medias: ItemMedia[] = [];

        if (dto.medias && Array.isArray(dto.medias) && dto.medias.length > 0) {
            const mediaEntities = await this.mediasService.findByIds(
                dto.medias,
            );

            if (mediaEntities.length !== dto.medias.length) {
                throw new NotFoundException('Some media files were not found');
            }

            mediaEntities.forEach((media, index) => {
                medias.push(
                    new ItemMedia(media.url, media.mediaType, index === 0),
                );
            });
        }

        const item = new Item({
            category: dto.category,
            sellerId: dto.sellerId ?? null,
            name: dto.name,
            description: dto.description,
            dimensions_cm: dto.dimensions,
            weight_kg: dto.weight_kg,
            desired_price: dto.desired_price,
            starting_price: dto.starting_price,
            ai_estimated_price: dto.ai_estimated_price,
            min_price_accepted: dto.min_price_accepted,
            sale_type: dto.sale_type,
            medias,
        });

        // TODO: attribuer les mediaIds a l'item id

        return this.itemRepository.save(item);
    }

    async findAll(): Promise<Item[]> {
        return this.itemRepository.findAll();
    }

    async findOne(id: string): Promise<Item | null> {
        return this.itemRepository.findById(id);
    }

    async update(id: string, dto: UpdateItemDto): Promise<Item | null> {
        return this.itemRepository.update(id, dto);
    }

    async remove(id: string): Promise<void> {
        return this.itemRepository.delete(id);
    }

    async findTopFavorited(
        limit = 10,
    ): Promise<{ item: ItemSchema; favCount: number }[]> {
        const rows: Array<{ itemId: string; favCount: string }> =
            await this.favRepo
                .createQueryBuilder('f')
                .select('f.itemId', 'itemId')
                .addSelect('COUNT(f.id)', 'favCount')
                .groupBy('f.itemId')
                .orderBy('COUNT(f.id)', 'DESC')
                .limit(limit)
                .getRawMany();

        if (rows.length === 0) return [];

        const ids = rows.map((r) => r.itemId);

        const items = await this.itemRepo.find({
            where: { id: In(ids) },
            relations: ['medias'],
        });

        for (const it of items) {
            const medias = (it.medias ?? []).filter(
                (m: Media) => m.mediaType === MediaType.IMAGE && m.isPrimary,
            );
            it.medias = medias;
        }

        const map = new Map(items.map((it) => [it.id, it]));

        return rows
            .map((r) => ({
                item: map.get(r.itemId)!,
                favCount: parseInt(r.favCount, 10),
            }))
            .filter((x) => !!x.item);
    async search(researchDto: ResearchItemDto): Promise<Item[]> {
        const { query, category } = researchDto;
        if (!query || !category || category.length === 0) {
            return [];
        }
        return await this.itemRepository.search(category, query);
    }
}
