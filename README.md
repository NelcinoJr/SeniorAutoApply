# SeniorAutoApply (HunterBot) 🤖

Sistema de automação de candidaturas via LinkedIn usando Laravel + Vue + Playwright.

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Docker Desktop instalado e rodando.
- PHP e Composer.
- Node.js e NPM.

### Passo a Passo da Primeira Execução

1. **Instalar Dependências do Backend**
   ```bash
   composer install
   ```

2. **Configurar o Frontend (Vue + Inertia)**
   ```bash
   php artisan breeze:install vue
   # Responda 'Yes' para Dark Mode e 'No' para SSR/Testing se perguntado.
   ```

3. **Subir os Serviços (Banco de Dados e Redis)**
   ```bash
   ./vendor/bin/sail up -d
   ```
   *Nota: Se não tiver o alias 'sail' configurado, use `./vendor/bin/sail`.*

4. **Rodar Migrações**
   ```bash
   ./vendor/bin/sail artisan migrate
   ```

5. **Instalar Dependências do Scraper**
   ```bash
   cd scraper
   npm install
   cd ..
   ```

6. **Rodar o Servidor Frontend**
   ```bash
   npm run dev
   ```

## 🛠 Como Testar

### Acessar o Painel
Abra [http://localhost](http://localhost) no seu navegador.

### Testar o Scraper
Para rodar o robô manualmente:
```bash
node scraper/index.js
```
*Ele deve abrir o Chromium e acessar o LinkedIn.*
