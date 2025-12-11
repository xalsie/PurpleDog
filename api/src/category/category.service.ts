import { Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
    private categories = [
        {
            name: 'Art',
            description: 'Paintings, sculptures, and other artworks',
            isChild: false,
        },
        {
            name: 'Books',
            description: 'Rare books, first editions, and manuscripts',
            isChild: false,
        },
        {
            name: 'Coins',
            description: 'Numismatic collections and rare coins',
            isChild: false,
        },
        {
            name: 'Stamps',
            description: 'Philatelic items and rare stamps',
            isChild: false,
        },
        {
            name: 'Toys',
            description: 'Vintage toys, action figures, and collectibles',
            isChild: false,
        },
        {
            name: 'Comics',
            description: 'Comic books and graphic novels',
            isChild: false,
        },
        {
            name: 'Cards',
            description: 'Trading cards, sports cards, and game cards',
            isChild: false,
        },
        {
            name: 'Vinyl Records',
            description: 'Vinyl albums and rare records',
            isChild: false,
        },
        {
            name: 'Watches',
            description: 'Luxury and vintage watches',
            isChild: false,
        },
        {
            name: 'Jewelry',
            description: 'Fine jewelry and costume jewelry',
            isChild: false,
        },
        {
            name: 'Antiques',
            description: 'Antique furniture and decorative items',
            isChild: false,
        },
        {
            name: 'Memorabilia',
            description: 'Sports memorabilia and celebrity items',
            isChild: false,
        },
        {
            name: 'Oil Paintings',
            description: 'Original oil paintings',
            isChild: true,
        },
        {
            name: 'Watercolors',
            description: 'Watercolor artworks',
            isChild: true,
        },
        {
            name: 'Sculptures',
            description: 'Three-dimensional art pieces',
            isChild: true,
        },
        {
            name: 'Fiction',
            description: 'Fiction novels and stories',
            isChild: true,
        },
        {
            name: 'Non-Fiction',
            description: 'Educational and informational books',
            isChild: true,
        },
        {
            name: 'Ancient Coins',
            description: 'Historical coins from ancient civilizations',
            isChild: true,
        },
        {
            name: 'Modern Coins',
            description: 'Collectible modern coins',
            isChild: true,
        },
        {
            name: 'Action Figures',
            description: 'Collectible action figures',
            isChild: true,
        },
        {
            name: 'Board Games',
            description: 'Vintage board games',
            isChild: true,
        },
        {
            name: 'Marvel Comics',
            description: 'Marvel comic books',
            isChild: true,
        },
        {
            name: 'DC Comics',
            description: 'DC comic books',
            isChild: true,
        },
        {
            name: 'Sports Cards',
            description: 'Baseball, basketball, and other sports cards',
            isChild: true,
        },
        {
            name: 'Pokemon Cards',
            description: 'Pokemon trading cards',
            isChild: true,
        },
        {
            name: 'Rock & Pop',
            description: 'Rock and pop vinyl records',
            isChild: true,
        },
        {
            name: 'Jazz & Classical',
            description: 'Jazz and classical music records',
            isChild: true,
        },
        {
            name: 'Luxury Watches',
            description: 'High-end luxury timepieces',
            isChild: true,
        },
        {
            name: 'Vintage Watches',
            description: 'Antique and vintage watches',
            isChild: true,
        },
        {
            name: 'Fine Jewelry',
            description: 'Gold, silver, and precious stone jewelry',
            isChild: true,
        },
        {
            name: 'Costume Jewelry',
            description: 'Fashion and costume jewelry pieces',
            isChild: true,
        },
    ];

    create(createCategoryDto: CreateCategoryDto): Partial<Category>[] {
        this.categories.push({
            name: createCategoryDto.name,
            description: createCategoryDto.description || '',
            isChild: createCategoryDto.isChild || false,
        });
        return this.categories;
    }

    findAll(): Partial<Category>[] {
        return this.categories;
    }

    findOne(name: string): Partial<Category> | Error {
        if (!name) {
            return new Error('ID must be provided');
        }
        const result = this.categories.find((cat) => cat.name === name);
        if (!result) {
            return new Error(`Category not found`);
        }
        return result;
    }
}
