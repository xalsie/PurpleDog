import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { createAgent } from 'langchain';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { catawikiScraperTool } from './tools/catawiki';
import { analyzeImages } from './vision';

const agentModel = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    temperature: 0.2,
    apiKey: process.env.GOOGLE_API_KEY,
});

const SYSTEM_TEMPLATE = `Tu es un expert mondial en estimation d'art. Ta mission est d'évaluer la valeur financière d'objets d'art en te basant sur des données de marché réelles.

PROTOCOLE D'ESTIMATION :
1. Analyse la description visuelle fournie par le module de vision.
2. Utilise l'outil 'catawiki_search' pour trouver des objets comparables (même artiste, même technique, période similaire).
3. Analyse les résultats :
        - Fais attention à la distinction entre "Prix de réserve non atteint" et "Vendu".
        - Prends en compte l'état de l'objet (condition) pour ajuster ton estimation par rapport aux comparables.
4. Fournis une estimation finale sous forme de fourchette (ex: 400€ - 600€) et justifie-la en citant précisément les exemples trouvés.

Si tu ne trouves pas de résultats exacts, élargis ta recherche ou base-toi sur ta connaissance générale en le précisant clairement (Mention "Estimation Théorique").

OUTPUT STRICT : Après avoir exécuté les outils et analysé les résultats, RÉPONDS STRICTEMENT PAR UN JSON VALIDE (aucun texte en plus) respectant le schéma suivant :
{
    "titre": string | null,                  // court
    "artiste": string | null,                // nom de l'artiste seulement
    "category_parent": string | null,        // une des catégories prédéfinies
    "category_enfant": Array<Array<string>> | null, // file d'arianne, ex: [["Arts", "Peinture"], ["Peintres", "Nom"]]
    "description_court": string | null,
    "description_longue": string | null,
    "estimated_price_min": number | null,
    "estimated_price_max": number | null,
    "currency": string | null,               // MAJUSCULES, ex: "EUR"
    "method": string | null,                 // "theoretical" ou "market"
    "country_of_origin": string | null,
    "style": string | null,
    "signature": string | null,
    "artwork_title": string | null,
    "style_subtype": string | null,
    "color": string | null,
    "weight": string | null
}

Règles supplémentaires :
- Utilise 'null' pour les valeurs inconnues.
- Les nombres doivent être des valeurs numériques (pas de séparateurs d'espaces), ex: 2500.5
- La clé "currency" doit être en MAJUSCULES (ex: "EUR").
- Ne renvoie PAS d'explications, seulement le JSON.
`;

function createValuationAgent() {
    const tools = [catawikiScraperTool];

    const agent = createAgent({
        model: agentModel,
        tools,
        systemPrompt: new SystemMessage({ content: SYSTEM_TEMPLATE }),
    });

    return agent;
}

export async function estimateArtworkValue(imagePaths: string) {
    try {
        console.log('🚀 DÉMARRAGE: Analyse visuelle');

        // Étape 1: Analyse visuelle par Gemini Vision (BLOQUANTE - on attend le résultat)
        const analysisResult = await analyzeImages(imagePaths);
        console.log(
            '✅ Analyse visuelle terminée:',
            JSON.stringify(analysisResult, null, 2),
        );

        // Étape 2: Recherche Catawiki DÉSACTIVÉE ICI
        // Maintenant disponible via POST /image-analysis/enrich/:analysisId
        // pour un appel optionnel en arrière-plan sans bloquer

        // Construire le résultat avec les données Gemini
        const toNumber = (v: any): number | null => {
            if (v === null || v === undefined) return null;
            if (typeof v === 'number') return Number.isFinite(v) ? v : null;
            const s = String(v).replace(/\s/g, '').replace(',', '.');
            const n = Number(s);
            return Number.isFinite(n) ? n : null;
        };

        const safeString = (v: any): string | null => {
            if (v === null || v === undefined) return null;
            const str = String(v).trim();
            return str.length > 0 ? str : null;
        };

        const output = {
            titre: safeString(analysisResult.titre),
            artiste: safeString(analysisResult.artiste),
            category_parent: safeString(analysisResult.category_parent),
            category_enfant: analysisResult.category_enfant,
            description_court: safeString(analysisResult.description_court),
            description_longue: safeString(analysisResult.description_longue),
            estimated_price_min: toNumber(analysisResult.estimated_price_min),
            estimated_price_max: toNumber(analysisResult.estimated_price_max),
            currency:
                safeString(analysisResult.currency)?.toUpperCase() || 'EUR',
            method: 'visual_analysis',
            country_of_origin: safeString(
                analysisResult.country_of_origin || analysisResult.country,
            ),
            style: safeString(analysisResult.style),
            signature: safeString(analysisResult.signature),
            artwork_title: safeString(
                analysisResult.artwork_title || analysisResult.artworkTitle,
            ),
            style_subtype: safeString(
                analysisResult.style_subtype || analysisResult.styleSubtype,
            ),
            color: safeString(analysisResult.color),
            weight: safeString(analysisResult.weight || analysisResult.Weight),
            height: safeString(analysisResult.height),
            width: safeString(analysisResult.width),
            depth: safeString(analysisResult.depth),
        };

        console.log(
            '📦 Résultat Gemini retourné immédiatement (Catawiki disponible via POST /enrich/:analysisId)',
        );

        return output;
    } catch (error) {
        console.error('Échec critique du pipeline :', error);
        throw error;
    }
}
