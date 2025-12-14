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
    category: string[];
    sellerId: string | null;
    name: string;
    description: string;
    dimensions_cm: DimensionsCm;
    weight_kg?: number;
    desired_price?: number;
    starting_price?: number;
    ai_estimated_price?: number | null;
    min_price_accepted?: number | null;
    sale_type: SaleType;
    status: ItemStatus;
    medias: ItemMedia[];

    brand?: string | null;
    model?: string | null;
    material?: string | null;
    color?: string | null;
    year?: string | null;
    condition?: string | null;
    authenticated?: boolean;

    id: string;
    createDateTime: Date;
    createdBy: string | null;
    internalComment: string | null;
    lastChangedDateTime: Date;
    lastChangedBy: string | null;
    isActive: boolean;
    isArchived: boolean;

    constructor(props: {
        category: string[];
        sellerId: string | null;
        name: string;
        description: string;
        dimensions_cm: DimensionsCm;
        sale_type: SaleType;
        medias?: ItemMedia[];
        weight_kg?: number;
        desired_price?: number;
        starting_price?: number;
        ai_estimated_price?: number | null;
        min_price_accepted?: number | null;
        status?: ItemStatus;
        id?: string;
        createDateTime?: Date;
        createdBy?: string | null;
        internalComment?: string | null;
        lastChangedDateTime?: Date;
        lastChangedBy?: string | null;
        isActive?: boolean;
        isArchived?: boolean;
        brand?: string | null;
        model?: string | null;
        material?: string | null;
        color?: string | null;
        year?: string | null;
        condition?: string | null;
        authenticated?: boolean;
    }) {
        if (props.id) this.id = props.id;
        this.category = props.category;
        this.sellerId = props.sellerId;
        this.name = props.name;
        this.description = props.description;
        this.dimensions_cm = props.dimensions_cm;
        this.weight_kg = props.weight_kg;
        this.desired_price = props.desired_price;
        this.starting_price = props.starting_price;
        this.ai_estimated_price = props.ai_estimated_price ?? null;
        this.min_price_accepted = props.min_price_accepted ?? null;
        this.sale_type = props.sale_type;
        this.status = props.status ?? ItemStatus.DRAFT;
        this.medias = props.medias ?? [];
        this.brand = props.brand ?? null;
        this.model = props.model ?? null;
        this.material = props.material ?? null;
        this.color = props.color ?? null;
        this.year = props.year ?? null;
        this.condition = props.condition ?? null;
        this.authenticated = props.authenticated ?? false;
        this.createDateTime = props.createDateTime ?? new Date();
        this.createdBy = props.createdBy ?? null;
        this.internalComment = props.internalComment ?? null;
        this.lastChangedDateTime = props.lastChangedDateTime ?? new Date();
        this.lastChangedBy = props.lastChangedBy ?? null;
        this.isActive = props.isActive ?? true;
        this.isArchived = props.isArchived ?? false;

        const images = this.medias.filter(
            (m) => m.mediaType === MediaType.IMAGE,
        );
        if (images.length < 1) {
            throw new Error('At least one image is required for an item.');
        }
    }
}
