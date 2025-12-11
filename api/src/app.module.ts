import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SecurityModule } from './security/security.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ItemsModule } from './items/items.module';
import { FavoriteModule } from './favorites/favorite.module';
import { QuickOfferModule } from './quick-offer/quick-offer.module';
import { BidsModule } from './bids/bids.module';
import { PurchasesModule } from './purchases/purchases.module';
import { MediasModule } from './medias/medias.module';
import { ImageAnalysisModule } from './image-analysis/image-analysis.module';
import { CategoryModule } from './category';

@Module({
    imports: [
        UserModule,
        AuthModule,
        SecurityModule,
        ItemsModule,
        FavoriteModule,
        QuickOfferModule,
        BidsModule,
        PurchasesModule,
        MediasModule,
        ImageAnalysisModule,
        CategoryModule,
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 60000,
                    limit: 10,
                },
            ],
        }),
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
    ],
    controllers: [AppController],
    providers: [AppService, { provide: 'APP_GUARD', useClass: ThrottlerGuard }],
    exports: [],
})
export class AppModule {}
