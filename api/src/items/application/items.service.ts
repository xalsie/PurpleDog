import { Inject, Injectable } from '@nestjs/common';
import { Item, ItemMedia } from '../domain/entities/item.entity';
import { ITEM_REPOSITORY } from '../domain/item.repository';
import type { ItemRepository } from '../domain/item.repository';
import { CreateItemDto } from '../dto/create-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';
import { ResearchItemDto } from '../dto/research-item.dto';

@Injectable()
export class ItemsService {
    constructor(
        @Inject(ITEM_REPOSITORY)
        private readonly itemRepository: ItemRepository,
    ) {}

    async create(dto: CreateItemDto): Promise<Item> {
        const medias: ItemMedia[] = [];
        if (dto.medias && Array.isArray(dto.medias)) {
            for (const m of dto.medias) {
                const url = String(m.url);
                const type = m.type;
                const isPrimary = !!m.isPrimary;
                medias.push(new ItemMedia(url, type, isPrimary));
            }
        }

        const item = new Item({
            sellerId: dto.sellerId,
            category: dto.category,
            name: dto.name,
            description: dto.description,
            dimensions_cm: dto.dimensions,
            weight_kg: dto.weight_kg,
            desired_price: dto.desired_price,
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

    async search(researchDto: ResearchItemDto): Promise<Item[]> {
        const { query, category } = researchDto;
        if (!query || !category || category.length === 0) {
            return [];
        }
        return await this.itemRepository.search(category, query);
    }
}
