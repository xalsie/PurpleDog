import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Bid } from './entities/bid.entity';
import { ItemSchema } from '../items/infrastructure/typeorm/item.schema';
import { ItemStatus, SaleType } from '../items/domain/entities/item.entity';

@Injectable()
export class BidsService {
    constructor(
        @InjectRepository(Bid)
        private readonly bidRepo: Repository<Bid>,
        @InjectRepository(ItemSchema)
        private readonly itemRepo: Repository<ItemSchema>,
    ) {}

    async create(createBidDto: CreateBidDto) {
        const item = await this.itemRepo.findOneBy({ id: createBidDto.itemId });

        if (!item || item.status !== ItemStatus.PUBLISHED) {
            throw new BadRequestException({
                statusCode: 400,
                code: 'ITEM_NOT_AVAILABLE',
                message: 'Item not found or not available for bidding',
                itemId: createBidDto.itemId,
            });
        }

        if (item.sale_type !== SaleType.AUCTION) {
            throw new BadRequestException({
                statusCode: 400,
                code: 'ITEM_NOT_AUCTION',
                message: 'Item is not available for auction',
                itemId: createBidDto.itemId,
            });
        }

        const existingBid = await this.bidRepo.findOneBy(createBidDto);

        if (existingBid) {
            throw new BadRequestException({
                statusCode: 400,
                code: 'BID_ALREADY_EXISTS',
                message: 'You have already placed a bid with this amount',
                itemId: createBidDto.itemId,
                amount: createBidDto.amount,
            });
        }

        const highestBid = await this.bidRepo
            .createQueryBuilder('b')
            .where('b.itemId = :itemId', { itemId: createBidDto.itemId })
            .orderBy('b.amount', 'DESC')
            .getOne();

        if (highestBid && createBidDto.amount <= Number(highestBid.amount)) {
            throw new BadRequestException({
                statusCode: 400,
                code: 'BID_TOO_LOW',
                message: 'There is already a higher or equal bid for this item',
                itemId: createBidDto.itemId,
                highestBid: highestBid.amount,
            });
        }

        const b = this.bidRepo.create(createBidDto);
        return this.bidRepo.save(b);
    }

    findAll(userId: string) {
        const bids = this.bidRepo.find({
            where: { userId },
            relations: ['item'],
            order: { createdAt: 'DESC' },
        });
        return bids;
    }

    findOne(id: string) {
        const bid = this.bidRepo.findOneBy({ id: id });
        return bid;
    }

    async update(id: string, updateBidDto: UpdateBidDto) {
        const bid = await this.bidRepo.preload({
            id: id,
            ...updateBidDto,
        });
        if (!bid) {
            throw new BadRequestException({
                statusCode: 400,
                code: 'BID_NOT_FOUND',
                message: 'Bid not found',
                id,
            });
        }
        return this.bidRepo.save(bid);
    }

    async remove(id: string) {
        return await this.bidRepo.delete(id);
    }
}
