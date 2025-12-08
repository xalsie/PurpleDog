import { Item } from '../domain/entities/item.entity';
import { ItemSchema } from './typeorm/item.schema';

export class ItemMapper {
    static toDomain(schema: ItemSchema): Item {
        return new Item(
            schema.id,
            schema.name,
            schema.category,
            schema.dimensions,
            schema.weight,
            schema.description,
            schema.documents,
            schema.photos,
            schema.desiredPrice,
            schema.saleMode,
        );
    }

    static toPersistence(item: Item): ItemSchema {
        const s = new ItemSchema();
        s.id = item.id;
        s.name = item.name;
        s.category = item.category;
        s.dimensions = item.dimensions;
        s.weight = item.weight;
        s.description = item.description;
        s.documents = item.documents;
        s.photos = item.photos;
        s.desiredPrice = item.desiredPrice;
        s.saleMode = item.saleMode;
        return s;
    }
}
