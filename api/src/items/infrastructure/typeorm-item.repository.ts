import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryDeepPartialEntity } from 'typeorm';
import { Item } from '../domain/entities/item.entity';
import { ItemRepository } from '../domain/item.repository';
import { ItemSchema } from './typeorm/item.schema';
import { ItemMapper } from './item.mapper';
import { UpdateItemDto } from '../dto/update-item.dto';

@Injectable()
export class TypeOrmItemRepository implements ItemRepository {
    constructor(
        @InjectRepository(ItemSchema)
        private readonly repo: Repository<ItemSchema>,
    ) {}

    async save(item: Item): Promise<Item> {
        const s = ItemMapper.toPersistence(item);
        const saved = await this.repo.save(s);
        return ItemMapper.toDomain(saved);
    }

    async findAll(): Promise<Item[]> {
        const all = await this.repo.find({ relations: ['medias'] });
        return all.map((s) => ItemMapper.toDomain(s));
    }

    async findById(id: string): Promise<Item | null> {
        const s = await this.repo.findOne({
            where: { id },
            relations: ['medias'],
        });
        return s ? ItemMapper.toDomain(s) : null;
    }

    async update(
        id: string,
        updateItemDto: UpdateItemDto,
    ): Promise<Item | null> {
        await this.repo.update(
            id,
            updateItemDto as QueryDeepPartialEntity<ItemSchema>,
        );
        const s = await this.repo.findOne({
            where: { id },
            relations: ['medias'],
        });
        return s ? ItemMapper.toDomain(s) : null;
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}
