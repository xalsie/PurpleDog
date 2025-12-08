export class Item {
    id: string;
    name: string;
    category: ItemCategory;
    dimensions: { height: number; width: number; depth: number };
    weight: number;
    description: string;
    documents: string[];
    photos: string[];
    desiredPrice: number;
    saleMode: 'auction' | 'quick-sale';

    constructor(
        id: string,
        name: string,
        category: ItemCategory,
        dimensions: { height: number; width: number; depth: number },
        weight: number,
        description: string,
        documents: string[],
        photos: string[],
        desiredPrice: number,
        saleMode: 'auction' | 'quick-sale',
    ) {
        if (photos.length < 10)
            throw new Error('An item must have at least 10 photos.');
        this.id = id;
        this.name = name;
        this.category = category;
        this.dimensions = dimensions;
        this.weight = weight;
        this.description = description;
        this.documents = documents;
        this.photos = photos;
        this.desiredPrice = desiredPrice;
        this.saleMode = saleMode;
    }
}

export enum ItemCategory {
    JEWELRY_WATCHES = 'Bijoux & montres',
    ANTIQUE_FURNITURE = 'Meubles anciens',
    ART_PAINTINGS = 'Objets d’art & tableaux',
    COLLECTIBLES = 'Objets de collection (jouets, timbres, monnaies…)',
    WINES_SPIRITS = 'Vins & spiritueux de collection',
    MUSICAL_INSTRUMENTS = 'Instruments de musique',
    ANTIQUE_BOOKS_MANUSCRIPTS = 'Livres anciens & manuscrits',
    FASHION_LUXURY = 'Mode & accessoires de luxe',
    CLOCKS_ANTIQUE_CLOCKS = 'Horlogerie & pendules anciennes',
    ANTIQUE_PHOTOGRAPHS_CAMERAS = 'Photographies anciennes & appareils vintage',
    TABLEWARE_SILVERWARE_CRYSTAL = 'Vaisselle & argenterie & cristallerie',
    SCULPTURES_DECORATIVE_OBJECTS = 'Sculptures & objets décoratifs',
    COLLECTOR_VEHICLES = 'Véhicules de collection (auto, moto, nautisme, etc.)',
}
