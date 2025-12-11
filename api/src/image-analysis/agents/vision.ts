import fs from 'fs';
import path from 'path';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';

const visionModel = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    maxOutputTokens: 8192,
    temperature: 0.1,
    apiKey: process.env.GOOGLE_API_KEY,
});

export async function analyzeImages(imagePaths: string): Promise<any> {
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
        text: `Tu es un expert mondial en évaluation d'objets. Analyse ces images en détail et fournis une estimation complète.

ANALYSE VISUELLE APPROFONDIE :
1. Type d'objet : Identifie précisément ce que tu vois (tableau, sculpture, meuble, bijou, livre, objet de collection, etc.)
2. Caractéristiques visuelles :
   - Matériaux identifiables (bois, métal, toile, papier, céramique, etc.)
   - Technique de fabrication/création visible
   - Style artistique ou période (Art Déco, Moderne, Ancien, etc.)
   - Couleurs dominantes
   - État de conservation visible (neuf, bon état, usure, dommages)
3. Éléments distinctifs :
   - Signatures, marques, cachets visibles
   - Inscriptions, textes lisibles
   - Motifs, décorations particulières
   - Provenance géographique ou culturelle (si identifiable)
4. DIMENSIONS ET POIDS (IMPORTANT) :
   - HAUTEUR : Estime en cm (basé sur indices visuels comme cadre, mur, etc.)
   - LARGEUR : Estime en cm
   - PROFONDEUR : Estime en cm (pour objets 3D)
   - POIDS : Estime en kg (basé sur le type d'objet et les matériaux)
   - Exemple: "hauteur: 80, largeur: 60, profondeur: 5, poids: 4.5"

5. DESCRIPTIONS OBLIGATOIRES (JAMAIS null) :
   - description_court : 1-2 phrases synthétisant EXACTEMENT ce que tu vois
   - description_longue : Analyse détaillée et complète (au minimum 3-4 phrases) incluant matériaux, style, état, particularités, contexte historique si pertinent

ESTIMATION DE VALEUR :
Basé sur ton expertise et ce que tu vois dans les images :
- Estime une fourchette de prix réaliste pour ce type d'objet dans cet état
- Justifie ton estimation en citant des catégories d'objets similaires
- Indique le niveau de confiance de ton estimation
- Si impossible à estimer: min 50, max 500 EUR

RÉPONSE STRICTEMENT EN JSON VALIDE (pas de texte avant ou après, pas de markdown) :
Réponds UNIQUEMENT avec un objet JSON valide, rien d'autre. Pas de blocs de code, pas de backticks, pas d'explications.
{
    "titre": "Description courte de l'objet",
    "artiste": "Nom de l'artiste ou créateur si identifiable, sinon null",
    "category_parent": "Catégorie principale (Arts, Meubles, Bijoux, Livres, Objets de collection, etc.)",
    "category_enfant": null,
    "description_court": "Résumé en 1-2 phrases de ce que tu vois réellement",
    "description_longue": "Analyse détaillée complète incluant matériaux, techniques, style, état, particularités. JAMAIS null, JAMAIS vide.",
    "estimated_price_min": 100,
    "estimated_price_max": 300,
    "currency": "EUR",
    "method": "visual_analysis",
    "country_of_origin": "Pays si identifiable",
    "style": "Style artistique ou période",
    "signature": "Signature ou marque visible",
    "artwork_title": "Titre de l'œuvre si lisible",
    "style_subtype": "Sous-style ou technique spécifique",
    "color": "Couleurs dominantes",
    "weight": "Poids estimé en kg (ex: '2.5')",
    "height": "Hauteur estimée en cm (ex: '80')",
    "width": "Largeur estimée en cm (ex: '60')",
    "depth": "Profondeur estimée en cm (ex: '5')"
}

IMPORTANT : 
- JAMAIS null pour description_court et description_longue
- Base ton analyse UNIQUEMENT sur ce que tu vois réellement dans les images
- Sois précis et factuel
- Les descriptions doivent être substantielles et informatives`,
    };

    const message = new HumanMessage({
        content: [textPart, ...imageParts] as any,
    });

    console.log(
        `Analyse de ${imagePathsArray.length} images en cours avec Gemini 2.5 Flash...`,
    );

    const response = await visionModel.invoke([message]);
    let content = response.content as string;
    
    console.log('📄 Réponse brute de Gemini (longueur:', content.length, ')');

    // STEP 1: Clean markdown code fences from response
    content = content
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();

    // STEP 2: Try direct JSON parsing first (cleanest case)
    try {
        const parsed = JSON.parse(content);
        console.log('✅ JSON parsé directement');
        
        // Ensure descriptions are never null
        if (!parsed.description_court || parsed.description_court === null) {
            parsed.description_court = `${parsed.titre || 'Objet'}. ${parsed.style ? 'Style: ' + parsed.style + '.' : ''}`;
        }
        if (!parsed.description_longue || parsed.description_longue === null) {
            const details = [
                parsed.titre || 'Objet analysé',
                parsed.artiste ? `Artiste: ${parsed.artiste}` : null,
                parsed.category_parent ? `Catégorie: ${parsed.category_parent}` : null,
                parsed.style ? `Style: ${parsed.style}` : null,
                parsed.country_of_origin ? `Provenance: ${parsed.country_of_origin}` : null,
                `État: Basé sur l'analyse visuelle`,
            ].filter(Boolean).join('. ');
            parsed.description_longue = details;
        }
        
        return parsed;
    } catch (error) {
        console.log('⚠️ Parse direct échoué, tentative extraction partielle...');
    }

    // STEP 3: Extract JSON object boundaries and try again
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}');
    
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
        // Find actual JSON boundaries by counting braces
        let braceCount = 0;
        let actualEnd = jsonStart;
        for (let i = jsonStart; i < content.length; i++) {
            if (content[i] === '{') braceCount++;
            if (content[i] === '}') braceCount--;
            if (braceCount === 0) {
                actualEnd = i;
                break;
            }
        }
        
        const jsonStr = content.substring(jsonStart, actualEnd + 1);
        
        try {
            const parsed = JSON.parse(jsonStr);
            console.log('✅ JSON extrait et parsé');
            
            // Ensure descriptions are never null
            if (!parsed.description_court || parsed.description_court === null) {
                parsed.description_court = `${parsed.titre || 'Objet'}. ${parsed.style ? 'Style: ' + parsed.style + '.' : ''}`;
            }
            if (!parsed.description_longue || parsed.description_longue === null) {
                const details = [
                    parsed.titre || 'Objet analysé',
                    parsed.artiste ? `Artiste: ${parsed.artiste}` : null,
                    parsed.category_parent ? `Catégorie: ${parsed.category_parent}` : null,
                    parsed.style ? `Style: ${parsed.style}` : null,
                    parsed.country_of_origin ? `Provenance: ${parsed.country_of_origin}` : null,
                    `État: Basé sur l'analyse visuelle`,
                ].filter(Boolean).join('. ');
                parsed.description_longue = details;
            }
            
            return parsed;
        } catch (e) {
            console.log('⚠️ JSON extrait reste invalide, réparation en cours...');
            
            // Try to repair incomplete JSON by closing unclosed strings/objects
            let repaired = jsonStr;
            
            // Count unmatched quotes
            const stringCount = (repaired.match(/(?<!\\)"/g) || []).length;
            if (stringCount % 2 === 1) {
                repaired += '"';
            }
            
            // Count unmatched braces
            const openBraces = (repaired.match(/\{/g) || []).length;
            const closeBraces = (repaired.match(/\}/g) || []).length;
            for (let i = 0; i < openBraces - closeBraces; i++) {
                repaired += '}';
            }
            
            try {
                const parsed = JSON.parse(repaired);
                console.log('✅ JSON réparé avec succès');
                
                // Ensure descriptions are never null
                if (!parsed.description_court || parsed.description_court === null) {
                    parsed.description_court = `${parsed.titre || 'Objet'}. ${parsed.style ? 'Style: ' + parsed.style + '.' : ''}`;
                }
                if (!parsed.description_longue || parsed.description_longue === null) {
                    const details = [
                        parsed.titre || 'Objet analysé',
                        parsed.artiste ? `Artiste: ${parsed.artiste}` : null,
                        parsed.category_parent ? `Catégorie: ${parsed.category_parent}` : null,
                        parsed.style ? `Style: ${parsed.style}` : null,
                        parsed.country_of_origin ? `Provenance: ${parsed.country_of_origin}` : null,
                        `État: Basé sur l'analyse visuelle`,
                    ].filter(Boolean).join('. ');
                    parsed.description_longue = details;
                }
                
                return parsed;
            } catch (e2) {
                console.log('❌ Réparation complète échouée, extraction basique...');
            }
        }
    }
    
    // STEP 4: Last resort - extract individual fields with regex
    console.log('⚠️ Basculer en mode extraction basique...');
    const partialInfo: any = {
        method: 'visual_analysis',
        currency: 'EUR'
    };
    
    // Extract titre
    const titreMatch = content.match(/"titre"\s*:\s*"([^"]*?)"/);
    if (titreMatch) partialInfo.titre = titreMatch[1];
    
    // Extract artiste
    const artisteMatch = content.match(/"artiste"\s*:\s*"([^"]*?)"/);
    if (artisteMatch) partialInfo.artiste = artisteMatch[1];
    
    // Extract category_parent
    const categoryMatch = content.match(/"category_parent"\s*:\s*"([^"]*?)"/);
    if (categoryMatch) partialInfo.category_parent = categoryMatch[1];
    
    // Extract description_court
    const descCourtMatch = content.match(/"description_court"\s*:\s*"([^"]*?)"/);
    if (descCourtMatch) partialInfo.description_court = descCourtMatch[1];
    
    // Extract description_longue (being careful with embedded quotes/markdown)
    const descLongMatch = content.match(/"description_longue"\s*:\s*"([^"]*?)"/);
    if (descLongMatch) {
        // Clean any remaining markdown from description
        let desc = descLongMatch[1];
        desc = desc.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        partialInfo.description_longue = desc;
    }
    
    // Extract estimated_price_min
    const priceMinMatch = content.match(/"estimated_price_min"\s*:\s*(\d+)/);
    if (priceMinMatch) partialInfo.estimated_price_min = parseInt(priceMinMatch[1]);
    
    // Extract estimated_price_max
    const priceMaxMatch = content.match(/"estimated_price_max"\s*:\s*(\d+)/);
    if (priceMaxMatch) partialInfo.estimated_price_max = parseInt(priceMaxMatch[1]);
    
    if (Object.keys(partialInfo).length === 2) {
        // Only default fields were found, content is probably not JSON at all
        console.error('❌ Impossible d\'extraire des données de Gemini');
        throw new Error('Invalid Gemini response format');
    }
    
    // Ensure descriptions are never null in fallback too
    if (!partialInfo.description_court || partialInfo.description_court === null) {
        partialInfo.description_court = `${partialInfo.titre || 'Objet'}. ${partialInfo.style ? 'Style: ' + partialInfo.style + '.' : ''}`;
    }
    if (!partialInfo.description_longue || partialInfo.description_longue === null) {
        const details = [
            partialInfo.titre || 'Objet analysé',
            partialInfo.artiste ? `Artiste: ${partialInfo.artiste}` : null,
            partialInfo.category_parent ? `Catégorie: ${partialInfo.category_parent}` : null,
            partialInfo.style ? `Style: ${partialInfo.style}` : null,
            partialInfo.country_of_origin ? `Provenance: ${partialInfo.country_of_origin}` : null,
            `État: Basé sur l'analyse visuelle`,
        ].filter(Boolean).join('. ');
        partialInfo.description_longue = details;
    }
    
    console.log('✅ Informations partielles extraites:', partialInfo);
    return partialInfo;
}
