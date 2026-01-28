<script setup>
import { ref, onMounted } from 'vue';

const jobs = ref([]);
const logs = ref([]);
const loading = ref(false);
const loadingProfile = ref(false);
const user = ref(null);
const loginRequired = ref(false);
const stats = ref({ found: 0, applied: 0, match: '0%' });
const searchForm = ref({ keywords: 'Laravel', location: 'Remote' });

const addLog = (msg, type = 'info') => {
    logs.value.unshift({ 
        id: Date.now(), 
        time: new Date().toLocaleTimeString(), 
        msg, 
        type 
    });
};

const fetchProfile = async () => {
    loadingProfile.value = true;
    try {
        const response = await fetch('/api/linkedin/profile');
        const result = await response.json();
        
        if (result.status === 'success' && result.data) {
            user.value = result.data;
            loginRequired.value = false;
            addLog(`👤 Identificado: ${result.data.name}`, 'success');
        } else if (result.action_required === 'login') {
            loginRequired.value = true;
            addLog('🔒 Login necessário. Clique em "Conectar LinkedIn".', 'warning');
        } else {
            addLog('⚠️ Não foi possível identificar o usuário.', 'warning');
        }
    } catch (e) {
        console.error(e);
        addLog('❌ Erro ao carregar perfil.', 'error');
    } finally {
        loadingProfile.value = false;
    }
};

onMounted(() => {
    fetchProfile();
});

const runLogin = async () => {
    loadingProfile.value = true;
    addLog('🔑 Iniciando processo de login...', 'info');
    try {
        const response = await fetch('/api/linkedin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            }
        });
        const result = await response.json();
        
        if (result.status === 'success') {
            addLog('✅ Login realizado com sucesso!', 'success');
            loginRequired.value = false;
            fetchProfile(); // Reload profile
        } else {
            addLog('❌ Falha no login: ' + result.message, 'error');
        }
    } catch (e) {
        addLog('❌ Erro na requisição de login.', 'error');
    } finally {
        loadingProfile.value = false;
    }
};

const runSearch = async () => {
    loading.value = true;
    logs.value = [];
    addLog(`🚀 Iniciando busca por "${searchForm.value.keywords}" em "${searchForm.value.location}"...`, 'info');
    
    try {
        const response = await fetch('/api/linkedin/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            },
            body: JSON.stringify(searchForm.value)
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            jobs.value = data.jobs;
            stats.value.found = data.count;
            addLog(`✅ Sucesso! Encontradas ${data.count} vagas.`, 'success');
        } else {
            addLog(`❌ Erro no robô: ${data.message}`, 'error');
            if (data.raw_output) console.error(data.raw_output);
        }

    } catch (error) {
        addLog('❌ Erro de conexão: ' + error.message, 'error');
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen bg-slate-100">
        <!-- Top Navigation -->
        <nav class="bg-white border-b border-slate-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex">
                        <div class="shrink-0 flex items-center gap-3">
                            <div class="bg-indigo-600 rounded-lg p-2">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                            </div>
                            <h1 class="text-xl font-bold text-slate-800 tracking-tight">SeniorAutoApply <span class="text-indigo-600">Pro</span></h1>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div v-if="user" class="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                            <img v-if="user.photoUrl" :src="user.photoUrl" class="w-8 h-8 rounded-full border border-slate-300" alt="Avatar">
                            <div class="flex flex-col">
                                <span class="text-xs font-bold text-slate-700 leading-tight">{{ user.name }}</span>
                                <span class="text-[10px] text-slate-500 max-w-[150px] truncate leading-tight">{{ user.headline }}</span>
                            </div>
                        </div>
                        <button v-else-if="loginRequired" @click="runLogin" :disabled="loadingProfile" class="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all">
                            {{ loadingProfile ? '⏳ Conectando...' : '🔗 Conectar LinkedIn' }}
                        </button>
                        <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" :class="loadingProfile ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'">
                            {{ loadingProfile ? '⏳ Carregando Perfil...' : '👤 Visitante' }}
                        </span>
                    </div>
                </div>
            </div>
        </nav>

        <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            
            <!-- Stats Grid -->
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <dt class="text-sm font-medium text-gray-500 truncate">Vagas Encontradas</dt>
                        <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ stats.found }}</dd>
                    </div>
                </div>
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <dt class="text-sm font-medium text-gray-500 truncate">Candidaturas Enviadas</dt>
                        <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ stats.applied }}</dd>
                    </div>
                </div>
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <dt class="text-sm font-medium text-gray-500 truncate">Match Médio</dt>
                        <dd class="mt-1 text-3xl font-semibold text-indigo-600">{{ stats.match }}</dd>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <!-- Main Content (Jobs) -->
                <div class="lg:col-span-2">
                    <div class="bg-white shadow rounded-lg min-h-[500px]">
                        <div class="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                            <div class="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
                                <h3 class="text-lg leading-6 font-medium text-gray-900 shrink-0">Oportunidades</h3>
                                <div class="flex-1 flex gap-2">
                                    <input v-model="searchForm.keywords" type="text" placeholder="Cargo ou Tecnologia" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
                                    <input v-model="searchForm.location" type="text" placeholder="Local" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
                                </div>
                                <button
                                    @click="runSearch"
                                    :disabled="loading"
                                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed transition-all shrink-0"
                                >
                                    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    {{ loading ? 'Buscando...' : 'Buscar Vagas' }}
                                </button>
                            </div>
                        </div>
                        
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local</th>
                                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="job in jobs" :key="job.url" class="hover:bg-gray-50">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm font-medium text-gray-900">{{ job.title }}</div>
                                            <div class="text-xs text-gray-500">{{ job.posted_date }}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ job.company }}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ job.location }}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <a :href="job.url" target="_blank" class="text-indigo-600 hover:text-indigo-900">Ver</a>
                                        </td>
                                    </tr>
                                    <tr v-if="jobs.length === 0 && !loading">
                                        <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                                            <div class="flex flex-col items-center">
                                                <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                                <p>Nenhuma vaga listada.</p>
                                                <p class="text-sm">Clique em "Buscar Agora" para ativar o robô.</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Console / Logs -->
                <div class="lg:col-span-1">
                    <div class="bg-slate-900 shadow rounded-lg h-[500px] flex flex-col">
                        <div class="px-4 py-3 border-b border-slate-700 bg-slate-800 rounded-t-lg">
                            <h3 class="text-sm font-mono font-medium text-slate-300 flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Terminal Log
                            </h3>
                        </div>
                        <div class="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300 space-y-2">
                            <div v-for="log in logs" :key="log.id" :class="{
                                'text-green-400': log.type === 'success',
                                'text-yellow-400': log.type === 'warning',
                                'text-red-400': log.type === 'error',
                                'text-slate-400': log.type === 'info'
                            }">
                                <span class="opacity-50">[{{ log.time }}]</span> {{ log.msg }}
                            </div>
                            <div v-if="logs.length === 0" class="text-slate-600 italic">
                                Aguardando comandos...
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    </div>
</template>
