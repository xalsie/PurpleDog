import { Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Purchase } from './entities/purchase.entity';

@Injectable()
export class PurchasesService {
    constructor(
        @InjectRepository(Purchase)
        private readonly purchaseRepo: Repository<Purchase>,
    ) {}

    async create(createPurchaseDto: CreatePurchaseDto) {
        const purchase = this.purchaseRepo.create({
            itemId: createPurchaseDto.itemId,
            buyerId: createPurchaseDto.buyerId,
            purchasedAt: new Date(),
            price: createPurchaseDto.price,
        });
        return this.purchaseRepo.save(purchase);
    }

    async findAll() {
        const purchases = await this.purchaseRepo.find();
        if (!purchases) {
            return [];
        }
        return purchases;
    }

    async listPurchases(userId: string) {
        return await this.purchaseRepo.find({
            where: { buyerId: userId },
            relations: ['item'],
            order: { purchasedAt: 'DESC' },
        });
    }

    async findOne(id: string) {
        const purchase = await this.purchaseRepo.findOneBy({ id });
        if (!purchase) {
            return null;
        }
        return purchase;
    }

    async update(id: string, updatePurchaseDto: UpdatePurchaseDto) {
        const purchase = await this.purchaseRepo.preload({
            id: id,
            ...updatePurchaseDto,
        });
        if (!purchase) {
            return null;
        }
        return this.purchaseRepo.save(purchase);
    }

    async remove(id: string) {
        return this.purchaseRepo.delete(id);
    }
}
