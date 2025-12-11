import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { Favorite } from './entities/favorite.entity';
import { ItemSchema } from '../items/infrastructure/typeorm/item.schema';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Favorite, ItemSchema, User])],
    controllers: [FavoriteController],
    providers: [FavoriteService],
})
export class FavoriteModule {}
