import { Item, ItemMedia, SaleType } from '../domain/entities/item.entity';
import { MediaType } from '../domain/entities/media.type';
import { ItemSchema } from './typeorm/item.schema';
import { Media } from '../../medias/entities/media.entity';

export class ItemMapper {
    static toDomain(schema: ItemSchema): Item {
        const medias: ItemMedia[] = [];
        if (schema.medias && Array.isArray(schema.medias)) {
            for (const m of schema.medias) {
                const url = String(m.url);
                const type = m.mediaType;
                const isPrimary = !!m.isPrimary;
                const mid = m.id as string | undefined;
                if (mid) medias.push(new ItemMedia(url, type, isPrimary, mid));
                else medias.push(new ItemMedia(url, type, isPrimary));
            }
        }

        const imageMedias = medias.filter(
            (m) => m.mediaType === MediaType.IMAGE,
        );
        if (imageMedias.length === 0) {
            medias.push(
                new ItemMedia('/images/placeholder.png', MediaType.IMAGE, true),
            );
        }

        let weight_kg: number | undefined = undefined;
        if (schema.weight_kg != null) {
            if (typeof schema.weight_kg === 'string') {
                weight_kg = parseFloat(String(schema.weight_kg));
            } else {
                weight_kg = schema.weight_kg;
            }
        }

        let desired_price: number | undefined = undefined;
        if (schema.desired_price != null) {
            if (typeof schema.desired_price === 'string') {
                desired_price = parseFloat(String(schema.desired_price));
            } else {
                desired_price = schema.desired_price;
            }
        }

        let starting_price: number | undefined = undefined;
        if (schema.starting_price != null) {
            if (typeof schema.starting_price === 'string') {
                starting_price = parseFloat(String(schema.starting_price));
            } else {
                starting_price = schema.starting_price;
            }
        }

        let ai_estimated_price: number | null = null;
        if (schema.ai_estimated_price != null) {
            if (typeof schema.ai_estimated_price === 'string') {
                ai_estimated_price = parseFloat(
                    String(schema.ai_estimated_price),
                );
            } else {
                ai_estimated_price = schema.ai_estimated_price;
            }
        }

        let min_price_accepted: number | null = null;
        if (schema.min_price_accepted != null) {
            if (typeof schema.min_price_accepted === 'string') {
                min_price_accepted = parseFloat(
                    String(schema.min_price_accepted),
                );
            } else {
                min_price_accepted = schema.min_price_accepted;
            }
        }

        const dimensions_cm = schema.dimensions_cm ?? {
            height: 0,
            width: 0,
            depth: 0,
        };

        const sale_type = schema.sale_type ?? SaleType.QUICK_SALE;

        return new Item({
            category: schema.category,
            id: schema.id,
            sellerId: schema.sellerId ?? schema.seller?.id ?? null,
            name: schema.name,
            description: schema.description,
            dimensions_cm,
            weight_kg: weight_kg,
            desired_price: desired_price,
            starting_price: starting_price,
            ai_estimated_price: ai_estimated_price,
            min_price_accepted: min_price_accepted,
            sale_type: sale_type,
            status: schema.status,
            medias: medias,
            brand: schema.brand ?? null,
            model: schema.model ?? null,
            material: schema.material ?? null,
            color: schema.color ?? null,
            year: schema.year ?? null,
            condition: schema.condition ?? null,
            authenticated: schema.authenticated ?? false,
            createDateTime: schema.createDateTime,
            createdBy: schema.createdBy,
            internalComment: schema.internalComment,
            lastChangedDateTime: schema.lastChangedDateTime,
            lastChangedBy: schema.lastChangedBy,
            isActive: schema.isActive,
            isArchived: schema.isArchived,
        });
    }

    static toPersistence(item: Item): ItemSchema {
        const s = new ItemSchema();
        if (item.id) s.id = item.id;
        s.category = item.category;
        s.seller = item.sellerId ? ({ id: item.sellerId } as any) : null;
        s.name = item.name;
        s.description = item.description;
        s.dimensions_cm = item.dimensions_cm;
        s.weight_kg = item.weight_kg ?? null;
        s.desired_price = item.desired_price ?? null;
        s.starting_price = item.starting_price ?? null;
        s.ai_estimated_price = item.ai_estimated_price ?? null;
        s.min_price_accepted = item.min_price_accepted ?? null;
        s.sale_type = item.sale_type;
        s.status = item.status;
        s.brand = item.brand ?? null;
        s.model = item.model ?? null;
        s.material = item.material ?? null;
        s.color = item.color ?? null;
        s.year = item.year ?? null;
        s.condition = item.condition ?? null;
        s.authenticated = item.authenticated ?? false;
        const mediasToPersist: ItemMedia[] = item.medias || [];
        s.medias = mediasToPersist.map((m: ItemMedia) => {
            const mm = new Media();
            if (m.id) mm.id = m.id;
            mm.url = m.url;
            mm.mediaType = m.mediaType;
            mm.isPrimary = m.isPrimary ?? false;
            return mm;
        });
        return s;
    }
}
