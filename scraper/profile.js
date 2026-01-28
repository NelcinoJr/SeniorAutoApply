import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { getBrowserContext } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(process.cwd(), '../.env') });

(async () => {
    let context = null;

    try {
        // Use headless mode for profile check (fast and invisible)
        context = await getBrowserContext(true);
        
        let page = context.pages()[0];
        if (!page) page = await context.newPage();
        
        // Go to Feed to get the sidebar info
        await page.goto('https://www.linkedin.com/feed/', { timeout: 30000, waitUntil: 'domcontentloaded' });
        
        // Check login
        if (!page.url().includes('linkedin.com/feed')) {
            console.log(JSON.stringify({ 
                status: 'error', 
                message: 'Não logado. Execute o Modo Login primeiro.',
                action_required: 'login'
            }));
            return;
        }

        // Wait for element
        try {
            await page.waitForSelector('.feed-identity-module', { timeout: 5000 });
        } catch (e) {
            // Ignore
        }

        // Extract Data
        const profileData = await page.evaluate(() => {
            const nameEl = document.querySelector('.feed-identity-module__actor-meta a div:first-child') || document.querySelector('.t-16.t-black.t-bold');
            const headlineEl = document.querySelector('.feed-identity-module__actor-meta .feed-identity-module__member-slug') || document.querySelector('.t-12.t-black--light.t-normal');
            const photoEl = document.querySelector('.feed-identity-module__member-photo') || document.querySelector('img.ghost-person');

            return {
                name: nameEl ? nameEl.innerText.trim() : 'Usuário LinkedIn',
                headline: headlineEl ? headlineEl.innerText.trim() : '',
                photoUrl: photoEl ? photoEl.src : null
            };
        });

        console.log(JSON.stringify({
            status: 'success',
            data: profileData
        }));

    } catch (error) {
        console.error(JSON.stringify({ status: 'error', message: error.message }));
    } finally {
        if (context) await context.close();
    }
})();
