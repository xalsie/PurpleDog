import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsController } from './items.controller';
import { ItemsService } from './application/items.service';
import { ItemSchema } from './infrastructure/typeorm/item.schema';
import { Media } from '../medias/entities/media.entity';
import { TypeOrmItemRepository } from './infrastructure/typeorm-item.repository';
import { ITEM_REPOSITORY } from './domain/item.repository';
import { Favorite } from '../favorites/entities/favorite.entity';
import { SecurityModule } from '../security/security.module';
import { User } from '../user/entities/user.entity';
import { MediasModule } from '../medias/medias.module';
import { AuctionsModule } from '../auctions/auctions.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ItemSchema, Media, Favorite, User]),
        SecurityModule,
        MediasModule,
        forwardRef(() => AuctionsModule),
    ],
    controllers: [ItemsController],
    providers: [
        ItemsService,
        {
            provide: ITEM_REPOSITORY,
            useClass: TypeOrmItemRepository,
        },
    ],
    exports: [ItemsService],
})
export class ItemsModule {}
