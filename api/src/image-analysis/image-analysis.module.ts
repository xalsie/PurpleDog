import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageAnalysisService } from './image-analysis.service';
import { ImageAnalysisController } from './image-analysis.controller';
import { MediasModule } from '../medias/medias.module';
import { SecurityModule } from '../security/security.module';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [MediasModule, SecurityModule, TypeOrmModule.forFeature([User])],
    controllers: [ImageAnalysisController],
    providers: [ImageAnalysisService],
})
export class ImageAnalysisModule {}
