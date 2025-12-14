import { chromium, Browser } from 'playwright';

const main = async () => {
    let browser: Browser | null = null;

    const query = 'Allegrain Baigneuse marbre';

    browser = await chromium.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Requis pour Docker/Linux
        slowMo: 50,
    });

    const context = await browser.newContext({
        userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
        locale: 'fr-FR',
        viewport: { width: 1280, height: 800 },
    });

    // cookies
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

    // Construction de l'URL de recherche
    // L'URL standard de recherche Catawiki suit ce pattern [9]
    const baseUrl = 'https://www.catawiki.com/fr/s';
    console.log(`Recherche Catawiki pour la requête : ${query}`);
    const searchUrl = `${baseUrl}?q=${encodeURIComponent(query)}&sort=relevance`;

    console.log(`Navigation vers : ${searchUrl}`);
    const response = await page.goto(searchUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
    });

    console.log('status', response?.status());
    await page.waitForTimeout(2000); // laisser du temps pour les JS

    try {
        const cookieButton = page
            .getByRole('button', { name: /accepter/i })
            .first();
        if (await cookieButton.isVisible({ timeout: 5000 })) {
            await cookieButton.click();
        }
    } catch (error) {
        console.log('Pas de bannière cookie ou erreur lors du clic.', error);
    }

    // Attente du chargement des résultats
    // On cible un conteneur générique de carte d'article.

    // wait 3 secondes
    // await new Promise((r) => setTimeout(r, 3000));

    // Erreur dans le script principal : page.waitForSelector: Timeout 5000ms exceeded.
    // Call log:
    // - waiting for locator('article[class*="c-lot-card__container"]') to be visible
    // log se qu'il y a dans la page
    const content = await page.content();
    // console.log('Contenu de la page:', content);

    await page.waitForSelector('article[class*="c-lot-card__container"]', {
        timeout: 5000,
    });

    console.log('Selector found, extracting results...');
    const items = await page.$$eval(
        'article[class*="c-lot-card__container"]',
        (elements) => {
            return elements.slice(0, 10).map((el) => {
                // Logique d'extraction exécutée DANS le contexte du navigateur
                const titleEl = el.querySelector(
                    'p[class*="c-lot-card__title"]',
                );
                console.log('titleEl:', titleEl);
                const priceEl = el.querySelector(
                    'p[class*="c-lot-card__price"]',
                );
                console.log('priceEl:', priceEl);
                const imgEl = el.querySelector('img');

                return {
                    title: titleEl
                        ? titleEl.textContent?.trim()
                        : 'Titre inconnu',
                    currentPrice: priceEl ? priceEl.textContent?.trim() : 'N/A',
                    url: el.getAttribute('href') || '',
                    imageUrl: imgEl ? imgEl.getAttribute('src') : '',
                };
            });
        },
    );

    console.log(`${items.length} éléments trouvés.`);
    console.log(JSON.stringify(items));
};

main().catch((error) => {
    console.error('Erreur dans le script principal :', error);
});
