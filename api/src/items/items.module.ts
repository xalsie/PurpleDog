import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsController } from './items.controller';
import { ItemsService } from './application/items.service';
import { ItemSchema } from './infrastructure/typeorm/item.schema';
import { ItemMediaSchema } from './infrastructure/typeorm/item-media.schema';
import { TypeOrmItemRepository } from './infrastructure/typeorm-item.repository';
import { ITEM_REPOSITORY } from './domain/item.repository';

@Module({
    imports: [TypeOrmModule.forFeature([ItemSchema, ItemMediaSchema])],
    controllers: [ItemsController],
    providers: [
        ItemsService,
        {
            provide: ITEM_REPOSITORY,
            useClass: TypeOrmItemRepository,
        },
    ],
})
export class ItemsModule {}
