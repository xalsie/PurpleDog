import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './entities/bid.entity';
import { Auction } from './entities/auction.entity';
import { AuctionsModule } from '../auctions/auctions.module';
import { User } from '../user/entities/user.entity';
import { SecurityModule } from '../security';
import { AuctionsGateway } from '../auctions/auctions.gateway';

@Module({
    imports: [
        TypeOrmModule.forFeature([Bid, Auction, User]),
        AuctionsModule,
        SecurityModule,
    ],
    controllers: [BidsController],
    providers: [BidsService, AuctionsGateway],
})
export class BidsModule {}
