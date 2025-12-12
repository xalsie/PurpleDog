import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { Auction } from '../bids/entities/auction.entity';
import { Bid } from '../bids/entities/bid.entity';
import { ItemSchema } from '../items/infrastructure/typeorm/item.schema';
import { ItemsModule } from '../items/items.module';
import { SecurityModule } from '../security/security.module';
import { UserModule } from '../user/user.module';
import { AuctionsGateway } from './auctions.gateway';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Auction, Bid, ItemSchema, User]),
        forwardRef(() => ItemsModule),
        SecurityModule,
        UserModule,
    ],
    controllers: [AuctionsController],
    providers: [AuctionsService, AuctionsGateway],
    exports: [AuctionsService, AuctionsGateway],
})
export class AuctionsModule {}
