import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './entities/bid.entity';
import { ItemSchema } from '../items/infrastructure/typeorm/item.schema';

@Module({
    imports: [TypeOrmModule.forFeature([Bid, ItemSchema])],
    controllers: [BidsController],
    providers: [BidsService],
})
export class BidsModule {}
