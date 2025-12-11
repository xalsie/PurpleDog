import fs from 'fs';
import path from 'path';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';

const visionModel = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    maxOutputTokens: 2048,
    temperature: 0.1,
    apiKey: process.env.GOOGLE_API_KEY,
});

export async function analyzeImages(imagePaths: string): Promise<string> {
    const imagePathsArray = imagePaths.split(',').map((p) => p.trim());
    const imageParts = imagePathsArray.map((p) => {
        const buffer = fs.readFileSync(p);
        const mineType =
            path.extname(p).toLowerCase() === '.png'
                ? 'image/png'
                : 'image/jpeg';
        return {
            type: 'image_url',
            image_url: {
                url: `data:${mineType};base64,${buffer.toString('base64')}`,
            },
        };
    });

    const textPart = {
        type: 'text',
        text: `Agis comme un expert évaluateur d'art chevronné. Analyse ces images conjointement.

    Tâche 1 : Identification
    - Identifie l'artiste (ou l'école/style si signature illisible).
    - Détermine la technique (ex: Huile sur toile, Lithographie, Sérigraphie).
    - Estime la période de création.
    - Évalue l'état de conservation visible (taches, déchirures, plis).

    Tâche 2 : Préparation à l'estimation
    - Génère 3 requêtes de recherche optimisées pour trouver des objets similaires sur des sites d'enchères comme Catawiki.
    - Ces requêtes doivent aller du plus spécifique au plus large.

    Format de sortie attendu (texte brut structuré) :
    ARTISTE: [Nom]
    TECHNIQUE:
    ETAT:
    KEYWORDS:
    DESCRIPTION: [Analyse détaillée]`,
    };

    const message = new HumanMessage({
        content: [textPart, ...imageParts] as any,
    });

    console.log(
        `Analyse de ${imagePathsArray.length} images en cours avec Gemini 2.5 Flash...`,
    );

    const response = await visionModel.invoke([message]);
    return response.content as string;
}
