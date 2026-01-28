import { getBrowserContext } from './utils.js';

(async () => {
    let context;
    try {
        console.log('🔵 Abrindo navegador para login...');
        context = await getBrowserContext(false); // Headful mode
        
        const page = context.pages()[0] || await context.newPage();
        
        console.log('👉 Acesse o LinkedIn e faça login manualmente.');
        await page.goto('https://www.linkedin.com/login', { timeout: 60000 });
        
        // Wait for login success (redirect to feed)
        // Give user 5 minutes to login
        try {
            await page.waitForURL('**/feed/**', { timeout: 300000 }); 
            console.log(JSON.stringify({ status: 'success', message: 'Login detectado! Sessão salva.' }));
        } catch (e) {
            console.log(JSON.stringify({ status: 'error', message: 'Tempo esgotado para login.' }));
        }

    } catch (error) {
        console.error(JSON.stringify({ status: 'error', message: error.message }));
    } finally {
        if (context) await context.close();
    }
})();
