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
            await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
            
            browser = await chromium.launch({
                headless: false,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-blink-features=AutomationControlled',
                ],
            });

            const context = await browser.newContext({
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
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

            await page.addInitScript(() => {
                Object.defineProperty(navigator, 'webdriver', { get: () => false });
            });

            const searchUrl = `https://www.catawiki.com/fr/s?q=${encodeURIComponent(query)}`;
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await page.waitForTimeout(2000);

            const bodyText = await page.textContent('body').catch(() => '') || '';
            if (bodyText.includes('Access Denied')) {
                throw new Error('WAF blocked');
            }

            const selectors = ['article', 'div[class*="lot"]', 'a[href*="/l/"]'];
            let foundSelector: string | null = null;

            for (const selector of selectors) {
                const count = await page.locator(selector).count();
                if (count > 3) {
                    foundSelector = selector;
                    break;
                }
            }

            if (!foundSelector) {
                throw new Error('No results found');
            }

            const items = await page.$$eval(foundSelector, (elements: Element[]) => {
                return elements.slice(0, 15).map((el) => {
                    const getText = (el: Element) => el.textContent?.trim() || '';
                    const titleEl = el.querySelector('h1, h2, h3, p[class*="title"]');
                    const priceEl = el.querySelector('[class*="price"], [class*="bid"]');
                    const linkEl = el.querySelector('a');
                    const title = titleEl ? getText(titleEl) : '';
                    if (!title || title.length < 5) return null;
                    return {
                        title,
                        currentPrice: priceEl ? getText(priceEl) : 'N/A',
                        url: linkEl?.getAttribute('href') || '',
                    };
                }).filter(Boolean);
            });

            const prices: number[] = [];
            items.forEach(item => {
                if (item?.currentPrice) {
                    const match = item.currentPrice.match(/[\d\s]+[,.]?\d*/);
                    if (match) {
                        const num = parseFloat(match[0].replace(/\s/g, '').replace(',', '.'));
                        if (!isNaN(num) && num > 0 && num < 1000000) prices.push(num);
                    }
                }
            });

            let estimatedPrice: number | null = null;
            let priceRange: { min: number; max: number } | null = null;

            if (prices.length > 0) {
                prices.sort((a, b) => a - b);
                const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
                estimatedPrice = Math.round(avg);
                priceRange = { min: Math.round(prices[0]), max: Math.round(prices[prices.length - 1]) };
                console.log(` Estimation: ${estimatedPrice}€ (${prices.length} résultats)`);
            }

            return JSON.stringify({ items, estimated_price: estimatedPrice, price_range: priceRange, total_results: items.length });
        } catch (error: any) {
            console.warn('Catawiki échoué:', error.message);
            return JSON.stringify({ error: true, message: error.message, items: [] });
        } finally {
            if (browser) await browser.close();
        }
    },
});
