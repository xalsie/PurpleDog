import { Module } from '@nestjs/common';
import { QuickOfferService } from './quick-offer.service';
import { QuickOfferController } from './quick-offer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuickOffer } from './entities/quick-offer.entity';
import { ItemSchema } from '../items/infrastructure/typeorm/item.schema';

@Module({
    imports: [TypeOrmModule.forFeature([QuickOffer, ItemSchema])],
    controllers: [QuickOfferController],
    providers: [QuickOfferService],
})
export class QuickOfferModule {}
