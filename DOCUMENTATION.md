# SeniorAutoApply - Documentação do Projeto

## 📋 Visão Geral

O **SeniorAutoApply** é um sistema de automação inteligente desenvolvido para otimizar o processo de candidatura a vagas de emprego sênior. Utilizando Laravel, Vue.js e Node.js com Playwright, o sistema automatiza a busca, análise e candidatura em vagas do LinkedIn.

---

## 🎯 Objetivos do Projeto

- **Automação de Candidaturas**: Reduzir o tempo gasto em candidaturas manuais
- **Análise Inteligente**: Usar IA para avaliar compatibilidade entre vagas e perfil
- **Gestão Centralizada**: Dashboard único para controlar todo o processo
- **Execução Local**: Sem custos de servidor ou infraestrutura complexa

---

## 🏗️ Arquitetura

### Stack Tecnológica

- **Backend**: Laravel 11 (PHP 8.3+)
- **Frontend**: Vue 3 + Inertia.js + Tailwind CSS
- **Scraper**: Node.js + Playwright
- **Banco de Dados**: SQLite (local)
- **Filas**: Sync (desenvolvimento)
- **Cache**: File-based

### Estrutura de Diretórios

```
/SeniorAutoApply
├── /app
│   ├── /Http/Controllers    # Controladores da aplicação
│   ├── /Models              # Modelos Eloquent
│   ├── /Services
│   │   ├── /AI              # Integração com OpenAI/Claude
│   │   └── /Scraper         # Integração com Node.js
│   └── /Providers           # Service Providers
├── /database
│   ├── /migrations          # Migrações do banco
│   └── database.sqlite      # Banco de dados SQLite
├── /resources
│   ├── /js                  # Componentes Vue
│   └── /views               # Templates Blade
├── /routes                  # Rotas da aplicação
├── /scraper                 # Scripts de automação
│   ├── index.js             # Script principal do bot
│   └── package.json         # Dependências Node
├── /storage                 # Arquivos e logs
├── .env                     # Variáveis de ambiente
├── composer.json            # Dependências PHP
└── package.json             # Dependências frontend
```

---

## 🚀 Instalação

### Pré-requisitos

- PHP 8.3 ou superior
- Composer 2.9+
- Node.js 18+ e NPM
- Chromium/Chrome (para o Playwright)

### Passo a Passo

1. **Clone ou acesse o diretório do projeto:**
   ```bash
   cd c:/projetos/SeniorAutoApply
   ```

2. **Instale as dependências do PHP:**
   ```bash
   php composer.phar install
   ```

3. **Instale as dependências do Node.js:**
   ```bash
   npm install
   cd scraper && npm install && cd ..
   ```

4. **Configure o ambiente:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Crie o banco de dados:**
   ```bash
   php artisan migrate
   ```

6. **Inicie o servidor:**
   ```bash
   php artisan serve
   ```

7. **Acesse a aplicação:**
   - URL: `http://localhost:8000`
   - Rota de teste do scraper: `http://localhost:8000/test-scraper`

---

## 🔧 Componentes Principais

### 1. Backend (Laravel)

#### Services

**AIService** (`app/Services/AI/AIService.php`)
- Responsável pela integração com APIs de IA (OpenAI/Claude)
- Analisa compatibilidade entre vagas e perfil
- Retorna score e justificativa

**ScraperService** (`app/Services/Scraper/ScraperService.php`)
- Executa o script Node.js via Process
- Timeout configurável (1 hora)
- Captura output e erros

#### Rotas

```php
// Página principal
GET / -> view('welcome')

// Teste do scraper
GET /test-scraper -> ScraperService::runScraper()
```

### 2. Scraper (Node.js)

**Tecnologia**: Playwright
**Localização**: `/scraper/index.js`

**Funcionalidades Implementadas**:
- Abertura do navegador (não-headless para debugging)
- Navegação para o LinkedIn
- Preparado para autenticação via cookies

**Próximos Passos**:
- Implementar login automático com cookies
- Buscar vagas por filtros
- Extrair dados das vagas
- Retornar JSON estruturado

### 3. Frontend (Vue + Inertia)

**Status**: Estrutura básica do Laravel
**Planejado**:
- Dashboard com lista de vagas
- Filtros por score de compatibilidade
- Botão "Apply" para disparar candidatura
- Log de atividades em tempo real

---

## 📊 Fluxo de Funcionamento

### MVP (Mínimo Produto Viável)

```
1. Usuário acessa Dashboard
   ↓
2. Sistema dispara Scraper (Node.js)
   ↓
3. Scraper busca vagas no LinkedIn
   ↓
4. Laravel recebe dados das vagas
   ↓
5. AIService analisa cada vaga
   ↓
6. Dashboard exibe vagas com score
   ↓
7. Usuário aprova candidatura
   ↓
8. Scraper preenche formulário e envia
```

---

## 🔐 Configuração de Cookies (LinkedIn)

Para evitar bloqueios e login manual:

1. **Instale a extensão EditThisCookie no Chrome**
2. **Faça login no LinkedIn manualmente**
3. **Exporte os cookies** (formato JSON)
4. **Salve em** `/scraper/cookies.json`
5. **O scraper vai carregar automaticamente**

---

## 🎨 Interface Planejada

### Dashboard Principal

```
┌─────────────────────────────────────────────────────┐
│  SeniorAutoApply - Dashboard                        │
├─────────────────────────────────────────────────────┤
│  [Buscar Novas Vagas]  [Minhas Candidaturas]        │
│                                                      │
│  📊 Estatísticas:                                    │
│  • Vagas Encontradas: 25                            │
│  • Candidaturas Enviadas: 12                        │
│  • Score Médio: 8.5/10                              │
│                                                      │
│  🎯 Vagas Recomendadas (Score > 8):                 │
│  ┌──────────────────────────────────────────────┐  │
│  │ Tech Lead Laravel - Empresa XYZ              │  │
│  │ Score: 9.5/10 ⭐⭐⭐⭐⭐                         │  │
│  │ "Alto match: 5 anos Laravel, liderança..."  │  │
│  │ [Ver Detalhes] [Candidatar Agora]           │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  📝 Log de Atividades:                              │
│  • 15:30 - Vaga analisada: Senior PHP Dev          │
│  • 15:28 - Candidatura enviada: Tech Lead          │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Comandos Úteis

### Desenvolvimento

```bash
# Rodar servidor Laravel
php artisan serve

# Rodar assets (Vite)
npm run dev

# Testar scraper manualmente
node scraper/index.js

# Limpar cache
php artisan cache:clear
php artisan config:clear
```

### Manutenção

```bash
# Atualizar dependências PHP
php composer.phar update

# Atualizar dependências Node
npm update

# Criar nova migration
php artisan make:migration create_jobs_table

# Criar novo Service
php artisan make:provider JobAnalysisServiceProvider
```

---

## 📝 Modelos de Dados (Planejados)

### Job (Vaga)

```php
- id
- title (string)
- company (string)
- description (text)
- url (string)
- score (float)
- reasoning (text)
- applied (boolean)
- applied_at (datetime)
- created_at
- updated_at
```

### Application (Candidatura)

```php
- id
- job_id (foreign key)
- status (pending|sent|rejected|interview)
- notes (text)
- applied_at (datetime)
```

### UserProfile (Perfil do Usuário)

```php
- id
- user_id
- resume_json (json)
- skills (json)
- experience_years (integer)
- desired_positions (json)
```

---

## 🔄 Roadmap

### Fase 1: MVP ✅
- [x] Setup do ambiente
- [x] Estrutura Laravel + Vue
- [x] Scraper básico (Playwright)
- [x] Services (AI + Scraper)
- [x] Banco de dados SQLite

### Fase 2: Core Features 🚧
- [ ] Implementar login automático via cookies
- [ ] Busca de vagas com filtros
- [ ] Parsing de dados das vagas
- [ ] Integração real com OpenAI
- [ ] Dashboard Vue funcional

### Fase 3: Automação Completa
- [ ] Preenchimento automático de formulários
- [ ] Envio de candidaturas
- [ ] Sistema de filas (Laravel Queues)
- [ ] Histórico de candidaturas
- [ ] Notificações de status

### Fase 4: Inteligência Avançada
- [ ] Machine Learning para melhorar scores
- [ ] Análise de taxa de sucesso
- [ ] Sugestões de melhoria no perfil
- [ ] Follow-up automático

---

## ⚠️ Avisos Importantes

### Limitações Técnicas

1. **Extensão ZIP do PHP**: O ambiente atual não tem a extensão ZIP configurada, por isso foi necessário instalar dependências via código-fonte.

2. **Sem Docker**: O projeto foi configurado para rodar sem Docker devido a problemas de compatibilidade.

3. **Rate Limiting**: O LinkedIn tem proteções contra scraping. Use delays entre requisições.

### Boas Práticas

- **Cookies de Sessão**: Renove os cookies do LinkedIn a cada 7-14 dias
- **Delays Inteligentes**: Aguarde 2-5 segundos entre ações no Playwright
- **Backup**: Faça backup regular do `database.sqlite`
- **Logs**: Monitore os logs em `storage/logs/laravel.log`

---

## 🐛 Troubleshooting

### Erro: "autoload.php not found"
**Solução**: Rode `php composer.phar dump-autoload`

### Erro: "APP_KEY not set"
**Solução**: Rode `php artisan key:generate`

### Erro: "npm run dev" não encontrando Vite
**Solução**: Rode `npm install` na raiz do projeto

### Scraper não abre navegador
**Solução**: 
1. Verifique se o Chrome está instalado
2. Rode `cd scraper && npm install` novamente

---

## 📞 Suporte

Para dúvidas ou contribuições:
- Verifique os logs em `/storage/logs`
- Rode `php artisan route:list` para ver todas as rotas
- Use `php artisan tinker` para debug do banco

---

## 📜 Licença

Projeto pessoal para uso individual.

---

**Última Atualização**: 20 de Janeiro de 2026
**Versão**: 0.1.0 (MVP)
**Status**: Em Desenvolvimento 🚧
