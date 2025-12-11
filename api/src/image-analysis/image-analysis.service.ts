import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { CreateImageAnalysisDto } from './dto/create-image-analysis.dto';
import { MediasService } from '../medias/medias.service';
import * as path from 'path';
import { estimateArtworkValue } from './agents/agent';

@Injectable()
export class ImageAnalysisService {
    constructor(private readonly mediasService: MediasService) {}

    async analyzeImage(createImageAnalysisDto: CreateImageAnalysisDto) {
        const { mediaIds } = createImageAnalysisDto;

        console.log('Analyzing images with media IDs:', mediaIds);

        const medias = await this.mediasService.findByIds(mediaIds);
        if (medias.length !== mediaIds.length) {
            throw new NotFoundException('Some media files were not found.');
        }

        // The agent pipeline expects a comma-separated string of absolute file paths.
        const imagePaths = medias
            .map((media) => path.join(process.cwd(), media.url))
            .join(', ');

        if (!imagePaths) {
            throw new NotFoundException('No valid media files to process.');
        }

        try {
            console.log(
                `🚀 Démarrage du pipeline d'agent pour les images : ${imagePaths}`,
            );
            // Calling the agent pipeline from agent.ts
            const result = await estimateArtworkValue(imagePaths);
            return result;
        } catch (error) {
            console.error(
                "Erreur lors de l'exécution du pipeline de l'agent:",
                error,
            );
            throw new InternalServerErrorException(
                'An error occurred during the agent-based image analysis.',
            );
        }
    }
}
