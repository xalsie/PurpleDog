import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { CreateImageAnalysisDto } from './dto/create-image-analysis.dto';
import { MediasService } from '../medias/medias.service';
import * as path from 'path';
import { estimateArtworkValue } from './agents/agent';
import { catawikiScraperTool } from './agents/tools/catawiki';

@Injectable()
export class ImageAnalysisService {
    private enrichmentCache = new Map<
        string,
        { data: any; timestamp: number }
    >();
    private readonly ENRICHMENT_TTL = 3600000; // 1 heure en millisecondes

    constructor(private readonly mediasService: MediasService) {
        setInterval(() => {
            const now = Date.now();
            for (const [key, value] of this.enrichmentCache.entries()) {
                if (now - value.timestamp > this.ENRICHMENT_TTL) {
                    this.enrichmentCache.delete(key);
                }
            }
        }, 3600000);
    }

    private extractJson(text: string): any {
        const jsonRegex = /```json\n([\s\S]*?)\n```/;
        const match = text.match(jsonRegex);
        if (match && match[1]) {
            try {
                return JSON.parse(match[1]);
            } catch (error) {
                console.error('Failed to parse JSON with markers:', error);
            }
        }

        const jsonStart = text.indexOf('{');
        if (jsonStart !== -1) {
            const jsonEnd = text.lastIndexOf('}');
            if (jsonEnd !== -1 && jsonEnd > jsonStart) {
                const jsonStr = text.substring(jsonStart, jsonEnd + 1);
                try {
                    return JSON.parse(jsonStr);
                } catch (error) {
                    console.error('Failed to parse raw JSON:', error);
                    console.log('Truncated JSON:', jsonStr);
                }
            }
        }

        return null;
    }

    async analyzeImage(createImageAnalysisDto: CreateImageAnalysisDto) {
        const { medias } = createImageAnalysisDto;

        console.log('Analyzing images with media IDs:', medias);

        const mediaFiles = await this.mediasService.findByIds(medias);
        if (mediaFiles.length !== medias.length) {
            throw new NotFoundException('Some media files were not found.');
        }

        // The agent pipeline expects a comma-separated string of absolute file paths.
        const imagePaths = mediaFiles
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

    async enrichWithCatawiki(
        analysisId: string,
        data: { artiste?: string; style?: string; titre?: string },
    ): Promise<any> {
        try {
            console.log(`🔍 Recherche Catawiki pour ${analysisId}`);

            // Extraire les mots-clés importants pour une recherche plus générique
            const searchParts: string[] = [];

            // Si on a un artiste, extraire juste le nom de famille
            if (data.artiste) {
                // Enlever les préfixes comme "Après", "Attribué à", etc.
                const cleanArtist = data.artiste
                    .replace(
                        /^(Après|D'après|Attribué à|Dans le goût de|École de)\s+/i,
                        '',
                    )
                    .replace(/\(.*?\)/g, '') // Enlever les dates
                    .trim();

                // Prendre juste le dernier mot (nom de famille généralement)
                const words = cleanArtist.split(/\s+/);
                const lastName = words[words.length - 1];
                if (lastName && lastName.length > 2) {
                    searchParts.push(lastName);
                }
            }

            // Ajouter le type d'objet du titre (statue, sculpture, vase, etc.)
            if (data.titre) {
                const objectTypes = [
                    'statue',
                    'sculpture',
                    'vase',
                    'tableau',
                    'peinture',
                    'bronze',
                    'buste',
                    'céramique',
                    'porcelaine',
                ];
                const lowerTitle = data.titre.toLowerCase();
                for (const type of objectTypes) {
                    if (lowerTitle.includes(type)) {
                        searchParts.push(type);
                        break;
                    }
                }
            }

            // Ajouter une partie du style si pas d'artiste
            if (!data.artiste && data.style) {
                const styleWords = data.style.split(/[,\s]+/);
                if (styleWords[0] && styleWords[0].length > 3) {
                    searchParts.push(styleWords[0]);
                }
            }

            const searchQuery = searchParts.join(' ').substring(0, 30);

            console.log(`🔍 Requête Catawiki simplifiée: "${searchQuery}"`);

            // Appeler l'outil Catawiki directement et attendre le résultat
            const result = await catawikiScraperTool.func({
                query: searchQuery,
            });

            const enrichmentData =
                typeof result === 'string' ? JSON.parse(result) : result;

            // Stocker dans le cache
            this.enrichmentCache.set(analysisId, {
                data: enrichmentData,
                timestamp: Date.now(),
            });

            console.log(
                `✅ Enrichissement Catawiki complété pour ${analysisId}`,
            );

            return enrichmentData;
        } catch (error: any) {
            console.warn(
                `⚠️ Enrichissement Catawiki échoué pour ${analysisId}: ${error.message}`,
            );
            // Stocker null dans le cache pour éviter de réessayer
            this.enrichmentCache.set(analysisId, {
                data: null,
                timestamp: Date.now(),
            });
            return null;
        }
    }

    getEnrichment(analysisId: string, deleteAfterRead = false): any {
        const cached = this.enrichmentCache.get(analysisId);
        if (!cached) {
            return null;
        }
        if (deleteAfterRead) {
            this.enrichmentCache.delete(analysisId);
        }
        return cached.data;
    }
}
