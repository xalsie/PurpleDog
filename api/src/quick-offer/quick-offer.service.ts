import { Injectable } from '@nestjs/common';
import { CreateQuickOfferDto } from './dto/create-quick-offer.dto';
import { UpdateQuickOfferDto } from './dto/update-quick-offer.dto';

import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuickOffer } from '../quick-offer/entities/quick-offer.entity';
import { ItemSchema } from '../items/infrastructure/typeorm/item.schema';
import { ItemStatus, SaleType } from '../items/domain/entities/item.entity';

@Injectable()
export class QuickOfferService {
    constructor(
        @InjectRepository(QuickOffer)
        private readonly qoRepo: Repository<QuickOffer>,
        @InjectRepository(ItemSchema)
        private readonly itemRepo: Repository<ItemSchema>,
    ) {}

    async create(createQuickOfferDto: CreateQuickOfferDto) {
        const item = await this.itemRepo.findOneBy({
            id: createQuickOfferDto.itemId,
        });

        if (!item || item.status !== ItemStatus.PUBLISHED) {
            throw new BadRequestException({
                statusCode: 400,
                code: 'ITEM_NOT_AVAILABLE',
                message: 'Item not found or not available for quick offer',
                itemId: createQuickOfferDto.itemId,
            });
        }

        if (item.sale_type !== SaleType.QUICK_SALE) {
            throw new BadRequestException({
                statusCode: 400,
                code: 'ITEM_NOT_QUICK_SALE',
                message: 'Item is not available for quick sale',
                itemId: createQuickOfferDto.itemId,
            });
        }

        const qo = this.qoRepo.create(createQuickOfferDto);
        return this.qoRepo.save(qo);
    }

    findAll() {
        const quickOffers = this.qoRepo.find();
        return quickOffers;
    }

    async findOne(id: string) {
        const quickOffer = await this.qoRepo.findOneBy({ id });
        if (!quickOffer) {
            throw new BadRequestException({
                statusCode: 400,
                code: 'QUICK_OFFER_NOT_FOUND',
                message: 'Quick offer not found',
                quickOfferId: id,
            });
        }
        return quickOffer;
    }

    async update(id: string, updateQuickOfferDto: UpdateQuickOfferDto) {
        const updated = await this.qoRepo.preload({
            id: id.toString(),
            ...updateQuickOfferDto,
        });
        if (!updated) {
            throw new BadRequestException({
                statusCode: 400,
                code: 'QUICK_OFFER_NOT_FOUND',
                message: 'Quick offer not found',
                quickOfferId: id,
            });
        }
        return updated;
    }

    async remove(id: string) {
        return await this.qoRepo.delete(id);
    }

    async listQuickOffers(userId: string) {
        return this.qoRepo.find({
            where: { userId },
            relations: ['item'],
            order: { createDateTime: 'DESC' },
        });
    }
}
