import { Item } from './entities/item.entity';
import { UpdateItemDto } from '../dto/update-item.dto';

export const ITEM_REPOSITORY = 'ITEM_REPOSITORY';

export interface ItemRepository {
    save(item: Item): Promise<Item>;
    findAll(): Promise<Item[]>;
    findById(id: string): Promise<Item | null>;
    update(id: string, item: UpdateItemDto): Promise<Item | null>;
    delete(id: string): Promise<void>;
}
