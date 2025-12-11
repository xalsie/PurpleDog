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
        console.log("--- DÉMARRAGE DU PIPELINE D'ESTIMATION ---");

        const visualAnalysis = await analyzeImages(imagePaths);
        console.log(
            '\n Analyse terminée :',
            visualAnalysis.substring(0, 100) + '...',
        );

        const executor = createValuationAgent();

        const artistMatch = visualAnalysis.match(/^ARTISTE:\s*(.*)/m);
        const artist = artistMatch
            ? artistMatch[1].split('(')[0].trim()
            : 'Artiste inconnu';

        const titleMatch = visualAnalysis.match(/la célèbre "([^"]+)"/);
        const artworkTitle = titleMatch ? titleMatch[1] : 'Titre non spécifié';

        const userPrompt = `Estime la valeur pour l'œuvre "${artworkTitle}" par l'artiste "${artist}". Concentre ta recherche sur Catawiki en utilisant ces informations pour trouver des œuvres comparables et baser ton estimation sur les prix du marché. RÉPONDS STRICTEMENT PAR UN JSON VALIDE CONFORME AU SCHÉMA SYSTÈME.`;

        const result = await executor.invoke({
            messages: [new HumanMessage({ content: userPrompt })],
        });

        try {
            console.log("\n--- TRACE COMPLÈTE DE L'AGENT (console only) ---");
            console.log(JSON.stringify(result.messages || result, null, 2));
        } catch (e) {
            console.log('Could not stringify agent result, raw:', e);
        }

        let finalText = '';
        const msgs = result.messages || [];
        for (let i = msgs.length - 1; i >= 0; i--) {
            const m: any = msgs[i];
            if (!m) continue;
            if (typeof m.content === 'string' && m.content.trim()) {
                finalText = m.content.trim();
                break;
            }
            if (typeof m.text === 'string' && m.text.trim()) {
                finalText = m.text.trim();
                break;
            }
            if (m.tool_response && typeof m.tool_response === 'string') {
                finalText = m.tool_response.trim();
                break;
            }
            try {
                const s = JSON.stringify(m.content || m);
                if (s && s !== '{}') {
                    finalText = s;
                    break;
                }
            } catch (e) {
                console.log('Error stringifying message content:', e);
            }
        }

        finalText = finalText || '';

        let parsed: any = null;
        const tryParse = (s: string) => {
            try {
                return JSON.parse(s);
            } catch (e) {
                console.log('JSON parsing error:', e);
                return null;
            }
        };

        parsed = tryParse(finalText);
        if (!parsed) {
            const first = finalText.indexOf('{');
            const last = finalText.lastIndexOf('}');
            if (first >= 0 && last > first) {
                const jsonSub = finalText.substring(first, last + 1);
                parsed = tryParse(jsonSub);
            }
        }

        const toNumber = (v: any): number | null => {
            if (v === null || v === undefined) return null;
            if (typeof v === 'number') return Number.isFinite(v) ? v : null;
            const s = String(v).replace(/\s/g, '').replace(',', '.');
            const n = Number(s);
            return Number.isFinite(n) ? n : null;
        };

        const safeString = (v: any): string | null => {
            if (v === null || v === undefined) return null;
            return String(v).trim() || null;
        };

        const output = {
            titre: null as string | null,
            artiste: null as string | null,
            category_parent: null as string | null,
            category_enfant: null as Array<Array<string>> | null,
            description_court: null as string | null,
            description_longue: null as string | null,
            estimated_price_min: null as number | null,
            estimated_price_max: null as number | null,
            currency: null as string | null,
            method: null as string | null,
            country_of_origin: null as string | null,
            style: null as string | null,
            signature: null as string | null,
            artwork_title: null as string | null,
            style_subtype: null as string | null,
            color: null as string | null,
            weight: null as string | null,
            estimation_text: finalText,
        };

        if (parsed && typeof parsed === 'object') {
            output.titre =
                safeString(parsed.titre) ||
                safeString(parsed.title) ||
                output.titre;
            output.artiste =
                safeString(parsed.artiste) ||
                safeString(parsed.artist) ||
                output.artiste ||
                artist;
            output.category_parent =
                safeString(parsed.category_parent) || output.category_parent;
            output.category_enfant =
                parsed.category_enfant ||
                parsed.category_child ||
                output.category_enfant;
            output.description_court =
                safeString(parsed.description_court) ||
                safeString(parsed.description_short) ||
                output.description_court;
            output.description_longue =
                safeString(parsed.description_longue) ||
                safeString(parsed.description_long) ||
                output.description_longue ||
                visualAnalysis;
            output.estimated_price_min = toNumber(
                parsed.estimated_price_min ||
                    parsed.estimated_min ||
                    parsed.min,
            );
            output.estimated_price_max = toNumber(
                parsed.estimated_price_max ||
                    parsed.estimated_max ||
                    parsed.max,
            );
            output.currency = safeString(
                parsed.currency || parsed.devise || parsed.currency,
            );
            if (output.currency)
                output.currency = output.currency.toUpperCase();
            output.method = safeString(parsed.method) || output.method;
            output.country_of_origin =
                safeString(parsed.country_of_origin) ||
                safeString(parsed.country) ||
                output.country_of_origin;
            output.style = safeString(parsed.style) || output.style;
            output.signature = safeString(parsed.signature) || output.signature;
            output.artwork_title =
                safeString(parsed.artwork_title) ||
                safeString(parsed.artworkTitle) ||
                output.artwork_title ||
                artworkTitle;
            output.style_subtype =
                safeString(parsed.style_subtype) ||
                safeString(parsed.styleSubtype) ||
                output.style_subtype;
            output.color = safeString(parsed.color) || output.color;
            output.weight = safeString(parsed.weight) || output.weight;
        } else {
            const num = (s: string | null) => {
                if (!s) return null;
                const cleaned = s
                    .replace(/[^0-9.,]/g, '')
                    .replace(/\s/g, '')
                    .replace(',', '.');
                const n = Number(cleaned);
                return Number.isFinite(n) ? n : null;
            };

            const priceMatch = finalText.match(
                /([0-9]{1,3}(?:[\s]?[0-9]{3})*(?:[.,][0-9]+)?)\s*(?:€|EUR)/i,
            );
            if (priceMatch && priceMatch[1]) {
                const p = num(priceMatch[1]);
                output.estimated_price_min = p;
                output.estimated_price_max = p;
                output.currency = 'EUR';
            }
            output.method =
                /Estimation Théo/i.test(finalText) ||
                /Estimation Théorique/i.test(finalText)
                    ? 'theoretical'
                    : 'market';
            output.description_longue =
                output.description_longue || visualAnalysis;
            output.artiste = output.artiste || artist;
            output.artwork_title = output.artwork_title || artworkTitle;
        }

        return output;
    } catch (error) {
        console.error('Échec critique du pipeline :', error);
        throw error;
    }
}
