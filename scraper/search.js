import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { getBrowserContext } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(process.cwd(), '../.env') });

(async () => {
    // Get arguments
    const args = process.argv.slice(2);
    const keywords = args[0] || '';
    const location = args[1] || '';

    if (!keywords) {
        console.error(JSON.stringify({ status: 'error', message: 'Keywords are required' }));
        process.exit(1);
    }

    let context = null;

    try {
        // Use headful for search just to be safe with LinkedIn anti-bot, 
        // but since we have dedicated profile, headless might work. 
        // Let's stick to headless for background operation, or headful if user wants to see it.
        // User complained about closing browser, so headless is safest UX.
        context = await getBrowserContext(true);

        let page = context.pages()[0];
        if (!page) page = await context.newPage();
        
        // Construct Search URL
        const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(location)}`;
        
        console.log(`Navigating to: ${searchUrl}`);
        await page.goto(searchUrl, { timeout: 30000, waitUntil: 'domcontentloaded' });
        
        if (!page.url().includes('linkedin.com')) {
             console.error(JSON.stringify({ status: 'error', message: 'Falha ao carregar LinkedIn' }));
             return;
        }

        // Wait for results
        try {
            await page.waitForSelector('.jobs-search-results-list', { timeout: 10000 });
        } catch (e) {
            // Fallback for different layouts
            await page.waitForSelector('.scaffold-layout__list-container', { timeout: 5000 });
        }

        // Scroll a bit to load items
        await page.evaluate(() => {
            const list = document.querySelector('.jobs-search-results-list') || document.body;
            list.scrollTop = list.scrollHeight;
        });
        await page.waitForTimeout(2000);

        // Extract Jobs
        const jobs = await page.evaluate(() => {
            const jobCards = document.querySelectorAll('.job-card-container');
            const results = [];

            jobCards.forEach(card => {
                try {
                    const titleEl = card.querySelector('.job-card-list__title') || card.querySelector('strong');
                    const companyEl = card.querySelector('.job-card-container__primary-description') || card.querySelector('.job-card-container__company-name');
                    const locationEl = card.querySelector('.job-card-container__metadata-item');
                    const linkEl = card.querySelector('a.job-card-container__link') || card.querySelector('a');
                    const id = card.getAttribute('data-job-id');
                    
                    if (titleEl && linkEl) {
                        results.push({
                            id: id || linkEl.href.split('view/')[1]?.split('/')[0] || Math.random().toString(36).substr(2, 9),
                            title: titleEl.innerText.trim(),
                            company: companyEl ? companyEl.innerText.trim() : 'Confidential',
                            location: locationEl ? locationEl.innerText.trim() : '',
                            url: linkEl.href.split('?')[0], // Clean URL
                            easyApply: !!card.innerText.includes('Easy Apply') || !!card.innerText.includes('Candidatura simplificada')
                        });
                    }
                } catch (e) {
                    // Skip bad card
                }
            });

            return results;
        });

        console.log(JSON.stringify({
            status: 'success',
            count: jobs.length,
            jobs: jobs
        }));

    } catch (error) {
        console.error(JSON.stringify({ status: 'error', message: error.message }));
    } finally {
        if (context) await context.close();
    }
})();
