import { z } from 'zod';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { chromium, Browser } from 'playwright';

const ScraperInputSchema = z.object({
    query: z
        .string()
        .describe('Les mots-clés optimisés pour la recherche sur Catawiki'),
    category: z
        .string()
        .optional()
        .describe('La catégorie optionnelle (ex: Art, Montres)'),
});

export const catawikiScraperTool = new DynamicStructuredTool({
    name: 'catawiki_search',
    description:
        "Recherche des prix d'œuvres d'art sur Catawiki. Renvoie une liste d'enchères passées ou en cours.",
    schema: ScraperInputSchema,
    func: async ({ query }) => {
        let browser: Browser | null = null;
        try {
            browser = await chromium.launch({
                headless: false,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                slowMo: Math.random() * 155 + 185, // random 185-340ms
            });

            // Bypass WAF avec contexte personnalisé
            const context = await browser.newContext({
                userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
                locale: 'fr-FR',
                viewport: { width: 1280, height: 800 },
            });

            // cookies Bypass WAF Catawiki
            await context.addCookies([
                {
                    name: 'cw_abcpbs',
                    value: 'df43b0e833a5e060ff8653071c4d0732',
                    domain: '.catawiki.com',
                    path: '/',
                    httpOnly: false,
                    secure: true,
                    sameSite: 'Lax',
                },
                {
                    name: 'absmartly_id',
                    value: 'b211d7bb-7a7b-4bca-ba79-9a910c3eaf7a',
                    domain: '.catawiki.com',
                    path: '/',
                    httpOnly: false,
                    secure: true,
                    sameSite: 'Lax',
                },
                {
                    name: 'cw_sid',
                    value: 'a13bc760e82b4e7ee0b176d0d531393e34e6ac9ab99712b5ce288c1c38cf402e',
                    domain: '.catawiki.com',
                    path: '/',
                    httpOnly: false,
                    secure: true,
                    sameSite: 'Lax',
                },
                {
                    name: 'enable_marketing_cookies',
                    value: 'false',
                    domain: '.catawiki.com',
                    path: '/',
                    httpOnly: false,
                    secure: true,
                    sameSite: 'Lax',
                },
                {
                    name: 'enable_analytical_cookies',
                    value: 'false',
                    domain: '.catawiki.com',
                    path: '/',
                    httpOnly: false,
                    secure: true,
                    sameSite: 'Lax',
                },
                {
                    name: 'cookie_preferences_used_cta',
                    value: 'manage',
                    domain: '.catawiki.com',
                    path: '/',
                    httpOnly: false,
                    secure: true,
                    sameSite: 'Lax',
                },
                {
                    name: 'has_pending_cookie_consent_sync',
                    value: 'true',
                    domain: '.catawiki.com',
                    path: '/',
                    httpOnly: false,
                    secure: true,
                    sameSite: 'Lax',
                },
                {
                    name: 'rmb_disabled_at',
                    value: '1765279486627',
                    domain: '.catawiki.com',
                    path: '/',
                    httpOnly: false,
                    secure: true,
                    sameSite: 'Lax',
                },
                {
                    name: 'cw_ab',
                    value: 'vxBEONTxEfCcPCahHY%2BLBAAB',
                    domain: '.catawiki.com',
                    path: '/',
                    httpOnly: false,
                    secure: true,
                    sameSite: 'Lax',
                },
            ]);

            const page = await context.newPage();

            const baseUrl = 'https://www.catawiki.com/fr/s';
            const searchUrl = `${baseUrl}?q=${encodeURIComponent(query)}&sort=bidding_end_desc`;

            await page.goto(searchUrl, {
                waitUntil: 'domcontentloaded',
                timeout: 10000,
            });

            await page.waitForTimeout(500);

            // continuer sans accepter les cookies
            try {
                const cookieButton = page
                    .getByRole('button', { name: /accepter/i })
                    .first();
                if (await cookieButton.isVisible({ timeout: 5000 })) {
                    await cookieButton.click();
                }
            } catch (error) {
                console.log(
                    'Pas de bannière cookie ou erreur lors du clic.',
                    error,
                );
            }

            await page.content();

            await page.waitForSelector(
                'article[class*="c-lot-card__container"]',
                {
                    timeout: 5000,
                },
            );

            const items = await page.$$eval(
                'article[class*="c-lot-card__container"]',
                (elements) => {
                    return elements.slice(0, 10).map((el) => {
                        const titleEl = el.querySelector(
                            'p[class*="c-lot-card__title"]',
                        );

                        const priceEl = el.querySelector(
                            'p[class*="c-lot-card__price"]',
                        );

                        const imgEl = el.querySelector('img');

                        const url = el.querySelector('a[class*="c-lot-card"]');

                        return {
                            title: titleEl
                                ? titleEl.textContent?.trim()
                                : 'Titre inconnu',
                            currentPrice: priceEl
                                ? priceEl.textContent?.trim()
                                : 'N/A',
                            url: url ? url.getAttribute('href') || '' : '',
                            imageUrl: imgEl ? imgEl.getAttribute('src') : '',
                        };
                    });
                },
            );

            console.log(`${items.length} éléments trouvés.`);
            return JSON.stringify(items);
        } catch (error) {
            console.error('Erreur Scraper:', error);
            return `Erreur lors de la recherche: ${(error as Error).message}`;
        } finally {
            if (browser) await browser.close();
        }
    },
});
