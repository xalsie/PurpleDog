import { Controller, Post, Body } from '@nestjs/common';
import { ImageAnalysisService } from './image-analysis.service';
import { CreateImageAnalysisDto } from './dto/create-image-analysis.dto';

@Controller('image-analysis')
export class ImageAnalysisController {
    constructor(private readonly imageAnalysisService: ImageAnalysisService) {}

    @Post()
    analyzeImage(@Body() createImageAnalysisDto: CreateImageAnalysisDto) {
        return this.imageAnalysisService.analyzeImage(createImageAnalysisDto);
    }
}
