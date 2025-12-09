import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './items/items.module';
import { FavoriteModule } from './favorites/favorite.module';
import { QuickOfferModule } from './quick-offer/quick-offer.module';
import { BidsModule } from './bids/bids.module';
import { PurchasesModule } from './purchases/purchases.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('POSTGRES_HOST'),
                port: configService.get<number>('POSTGRES_PORT'),
                username: configService.get<string>('POSTGRES_USER'),
                password: configService.get<string>('POSTGRES_PASSWORD'),
                database: configService.get<string>('POSTGRES_DB'),
                autoLoadEntities: true,
                synchronize: true,
            }),
        }),
        ItemsModule,
        FavoriteModule,
        QuickOfferModule,
        BidsModule,
        PurchasesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
