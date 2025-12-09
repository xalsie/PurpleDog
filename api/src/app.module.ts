import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SecurityModule } from './security/security.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ItemsModule } from './items/interface/http/items.module';

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
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_DATABASE'),
            autoLoadEntities: true,
            synchronize: true
        }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: 'APP_GUARD', useClass: ThrottlerGuard }],
  exports: [],
})
export class AppModule {}
