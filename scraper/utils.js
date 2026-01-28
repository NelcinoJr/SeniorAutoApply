import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Diretório local para salvar dados do navegador (Cookies, Cache, Login)
const USER_DATA_DIR = path.join(__dirname, 'browser_data');

export const getBrowserContext = async (headless = true) => {
    // Garante que o diretório existe
    if (!fs.existsSync(USER_DATA_DIR)) {
        fs.mkdirSync(USER_DATA_DIR, { recursive: true });
    }

    // console.log(`🚀 Iniciando navegador dedicado (Perfil: ${USER_DATA_DIR})...`);

    const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
        headless: headless,
        viewport: { width: 1280, height: 720 },
        ignoreDefaultArgs: ["--enable-automation"],
        args: [
            "--no-sandbox", 
            "--disable-blink-features=AutomationControlled",
            "--disable-infobars"
        ]
    });

    return context;
};
