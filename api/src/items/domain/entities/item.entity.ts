import { MediaType } from './media.type';

export type DimensionsCm = { height: number; width: number; depth: number };

export enum SaleType {
    AUCTION = 'AUCTION',
    QUICK_SALE = 'QUICK_SALE',
}

export enum ItemStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    SOLD = 'SOLD',
    ARCHIVED = 'ARCHIVED',
}

export class ItemMedia {
    id?: string;
    url: string;
    mediaType: MediaType;
    isPrimary?: boolean;

    constructor(
        url: string,
        mediaType: MediaType,
        isPrimary = false,
        id?: string,
    ) {
        this.url = url;
        this.mediaType = mediaType;
        this.isPrimary = isPrimary;
        if (id) this.id = id;
    }
}

export class Item {
    id?: string;
    sellerId: number | null;
    categoryId: number | null;
    name: string;
    description: string;
    dimensions_cm: DimensionsCm;
    weight_kg?: number;
    desired_price?: number;
    ai_estimated_price?: number | null;
    min_price_accepted?: number | null;
    sale_type: SaleType;
    status: ItemStatus;
    medias: ItemMedia[];
    created_at?: Date;

    constructor(props: {
        sellerId: number | null;
        categoryId: number | null;
        name: string;
        description: string;
        dimensions_cm: DimensionsCm;
        sale_type: SaleType;
        medias?: ItemMedia[];
        weight_kg?: number;
        desired_price?: number;
        ai_estimated_price?: number | null;
        min_price_accepted?: number | null;
        status?: ItemStatus;
        id?: string;
        created_at?: Date;
    }) {
        this.id = props.id;
        this.sellerId = props.sellerId;
        this.categoryId = props.categoryId;
        this.name = props.name;
        this.description = props.description;
        this.dimensions_cm = props.dimensions_cm;
        this.weight_kg = props.weight_kg;
        this.desired_price = props.desired_price;
        this.ai_estimated_price = props.ai_estimated_price ?? null;
        this.min_price_accepted = props.min_price_accepted ?? null;
        this.sale_type = props.sale_type;
        this.status = props.status ?? ItemStatus.DRAFT;
        this.medias = props.medias ?? [];
        this.created_at = props.created_at;

        const images = this.medias.filter(
            (m) => m.mediaType === MediaType.IMAGE,
        );
        if (images.length < 1) {
            throw new Error('At least one image is required for an item.');
        }
    }
}
