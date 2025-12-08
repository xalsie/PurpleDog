import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto'
import { Item } from '../domain/entities/item.entity';
import { ITEM_REPOSITORY } from '../domain/item.repository';
import type { ItemRepository } from '../domain/item.repository';
import { CreateItemDto } from '../dto/create-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';

@Injectable()
export class ItemsService {
    constructor(
        @Inject(ITEM_REPOSITORY)
        private readonly itemRepository: ItemRepository,
    ) {}

    async create(dto: CreateItemDto): Promise<Item> {
        const item = new Item(
            randomUUID(),
            dto.name,
            dto.category as any,
            dto.dimensions as any,
            dto.weight,
            dto.description,
            dto.documents,
            dto.photos,
            dto.desiredPrice,
            dto.saleMode,
        );
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
}
