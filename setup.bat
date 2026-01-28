@echo off
echo --- SeniorAutoApply Setup ---

echo 1. Instalando dependencias do Laravel (PHP)...
call composer install

echo 2. Configurando Vue + Inertia + Tailwind...
call php artisan breeze:install vue --dark --ssr

echo 3. Instalando dependencias do Frontend (Node)...
call npm install

echo 4. Instalando dependencias do Scraper...
cd scraper
call npm install
cd ..

echo 5. Subindo o ambiente Docker...
call ./vendor/bin/sail up -d

echo 6. Criando Banco de Dados...
call ./vendor/bin/sail artisan migrate

echo --- Instalacao Concluida! ---
echo Para iniciar o site, rode: npm run dev
pause
