import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { CreateImageAnalysisDto } from './dto/create-image-analysis.dto';

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';

import { MediasService } from '../medias/medias.service';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);

@Injectable()
export class ImageAnalysisService {
    constructor(private readonly mediasService: MediasService) {}

    private extractJson(text: string): any {
        const jsonRegex = /```json\n([\s\S]*?)\n```/;
        const match = text.match(jsonRegex);
        if (match && match[1]) {
            try {
                return JSON.parse(match[1]);
            } catch (error) {
                console.error('Failed to parse JSON:', error);
                return null;
            }
        }
        return null;
    }

    async analyzeImage(createImageAnalysisDto: CreateImageAnalysisDto) {
        const { mediaIds, category } = createImageAnalysisDto;

        const medias = await this.mediasService.findByIds(mediaIds);
        if (medias.length !== mediaIds.length) {
            throw new NotFoundException('Some media files were not found.');
        }

        const imageParts = await Promise.all(
            medias.map(async (media) => {
                const imagePath = path.join(process.cwd(), media.url);
                const imageBuffer = await readFileAsync(imagePath);
                const mimeType =
                    path.extname(media.url) === '.png'
                        ? 'image/png'
                        : 'image/jpeg';

                return {
                    type: 'image_url' as const,
                    image_url: `data:${mimeType};base64,${imageBuffer.toString(
                        'base64',
                    )}`,
                };
            }),
        );

        const model = new ChatGoogleGenerativeAI({
            model: 'gemini-2.5-flash',
            maxOutputTokens: 2048,
            temperature: 0.2,
            apiKey: process.env.GOOGLE_API_KEY,
        });

        const textPart = {
            type: 'text' as const,
            text: `En tant qu'expert commissaire-priseur d'art, analysez l'image ou les images fournies correspondant à la catégorie principale "${category}".
Si nécessaire, effectuez une recherche sur le web pour compléter votre analyse (par exemple, pour identifier l'artiste, le style ou l'époque).

Votre réponse DOIT être un unique objet JSON valide, encapsulé dans \`\`\`json ... \`\`\`.
N'incluez aucun texte avant ou après l'objet JSON.

L'objet JSON doit contenir les champs suivants, avec des valeurs en **français**:
- "title": (string) Un titre concis et attrayant pour l'œuvre.
- "short_description": (string) Une brève description en une phrase.
- "long_description": (string) Une description détaillée d'un paragraphe.
- "child_category": (string) Suggérez une sous-catégorie pertinente.
- "estimated_price": (number) Fournissez une estimation du prix en euros. La valeur doit être un nombre, pas une chaîne de caractères.
- "Era": (string) La période historique de l'œuvre.
- "Style subtype": (string) Le sous-type de style spécifique.
- "Country of origin": (string) Le pays où l'œuvre a été créée.
- "Style": (string) Le style artistique principal.
- "Material": (string) Les matériaux utilisés pour créer l'œuvre.
- "Artist": (string) Le nom de l'artiste. Si inconnu, utilisez "Inconnu".
- "Artwork title": (string) Le titre officiel de l'œuvre. Si inconnu, utilisez le titre généré.
- "Signature": (string) Décrivez la signature si elle est présente (par exemple, "Signé en bas à droite"). Si absente, utilisez "Non signé".
- "Color": (string) Les couleurs dominantes de l'œuvre.
- "Weight": (string) Le poids estimé (par exemple, "5 kg").

Si un champ n'est pas applicable ou si l'information n'est pas disponible, utilisez "N/A" pour les champs de type chaîne de caractères. Pour le champ numérique "estimated_price", utilisez 0 si la valeur est inconnue.

Exemple du format JSON exact attendu :
\`\`\`json
{
  "title": "Titre de l'oeuvre...",
  "short_description": "Courte description en français...",
  "long_description": "Longue description en français...",
  "child_category": "Sous-catégorie...",
  "estimated_price": "...",
  "Era": "...",
  "Style subtype": "...",
  "Country of origin": "...",
  "Style": "...",
  "Material": "...",
  "Artist": "...",
  "Artwork title": "...",
  "Signature": "...",
  "Color": "...",
  "Weight": "..."
}
\`\`\`
`,
        };

        const message = new HumanMessage({
            content: [textPart, ...imageParts],
        });

        try {
            console.log('🎨 Analyse Gemini en cours...');

            const response = await model.invoke([message]);

            console.log('\n--- Résultat Gemini ---');
            console.log(response.content);

            const jsonResponse = this.extractJson(response.content as string);
            if (!jsonResponse) {
                throw new InternalServerErrorException(
                    'Failed to parse JSON from the model response.',
                );
            }

            return jsonResponse;
        } catch (error) {
            console.error("Erreur lors de l'analyse:", error);
            if (error instanceof InternalServerErrorException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'An unexpected error occurred during image analysis.',
            );
        }
    }
}
