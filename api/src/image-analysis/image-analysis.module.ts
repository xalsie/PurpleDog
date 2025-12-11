import { Module } from '@nestjs/common';
import { ImageAnalysisService } from './image-analysis.service';
import { ImageAnalysisController } from './image-analysis.controller';
import { MediasModule } from '../medias/medias.module';

@Module({
    imports: [MediasModule],
    controllers: [ImageAnalysisController],
    providers: [ImageAnalysisService],
})
export class ImageAnalysisModule {}
