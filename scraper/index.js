import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { getBrowserContext } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(process.cwd(), '../.env') });

(async () => {
    let browserInstance = null;
    let context = null;

    try {
        const result = await getBrowserContext();
        browserInstance = result.browser;
        context = result.context;

        let page = context.pages()[0];
        if (!page) page = await context.newPage();
        
        console.log('Acessando LinkedIn...');
        await page.goto('https://www.linkedin.com/feed', { timeout: 60000 });
        
        // Verifica login
        const isLoggedIn = page.url().includes('linkedin.com/feed');
        
        console.log(JSON.stringify({
            status: 'success',
            logged_in: isLoggedIn,
            message: isLoggedIn ? 'Conectado com sucesso!' : 'Não logado.'
        }));
        
    } catch (error) {
        console.error(JSON.stringify({
            status: 'error',
            message: error.message
        }));
    } finally {
        if (!browserInstance && context) {
            await context.close();
        } else if (browserInstance) {
            await browserInstance.disconnect();
        }
    }
})();
