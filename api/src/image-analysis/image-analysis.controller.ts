import { Controller, Post, Body, UseGuards, Param, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImageAnalysisService } from './image-analysis.service';
import { CreateImageAnalysisDto } from './dto/create-image-analysis.dto';
import { AuthGuard } from '../security/auth.guard';
import { CurrentUser, User } from '../user';

@ApiTags('image-analysis')
@Controller('image-analysis')
export class ImageAnalysisController {
    constructor(private readonly imageAnalysisService: ImageAnalysisService) {}

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Analyze images with AI" })
    @ApiResponse({ status: 200, description: 'Analysis completed' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    analyzeImage(
        @Body() createImageAnalysisDto: CreateImageAnalysisDto,
    ) {
        console.log('📥 POST /image-analysis received:');
        console.log('   DTO:', JSON.stringify(createImageAnalysisDto, null, 2));
        console.log('   category type:', typeof createImageAnalysisDto.category);
        console.log('   medias type:', Array.isArray(createImageAnalysisDto.medias) ? 'array' : typeof createImageAnalysisDto.medias);
        console.log('   medias:', createImageAnalysisDto.medias);
        return this.imageAnalysisService.analyzeImage(createImageAnalysisDto);
    }

    @Post('enrich/:analysisId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Enrich analysis with Catawiki data" })
    @ApiResponse({ status: 200, description: 'Enrichment data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async enrichAnalysis(
        @Param('analysisId') analysisId: string,
        @Body() body: { artiste?: string; style?: string; titre?: string },
    ) {
        const enrichmentData = await this.imageAnalysisService.enrichWithCatawiki(analysisId, body);
        
        return { 
            message: enrichmentData ? 'Enrichment completed' : 'No results found',
            analysisId,
            data: enrichmentData
        };
    }

    @Get('enrichment/:analysisId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Get enrichment results (if available)" })
    @ApiResponse({ status: 200, description: 'Enrichment data' })
    @ApiResponse({ status: 204, description: 'No enrichment available yet' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getEnrichment(@Param('analysisId') analysisId: string) {
        const enrichment = this.imageAnalysisService.getEnrichment(analysisId, true);
        if (!enrichment) {
            return { message: 'No enrichment available yet', data: null };
        }
        return { data: enrichment };
    }
}
