<?php

namespace App\Services\Scraper;

use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class ScraperService
{
    public function runScraper()
    {
        return $this->runScript('index.js');
    }

    public function runLoginScraper()
    {
        return $this->runScript('login.js');
    }

    public function runProfileScraper()
    {
        return $this->runScript('profile.js');
    }

    public function runSearchScraper($keywords, $location = '')
    {
        return $this->runScript('search.js', [$keywords, $location]);
    }

    private function runScript(string $scriptName, array $args = [])
    {
        $workingDir = base_path('scraper');
        
        $command = array_merge(['node', $scriptName], $args);

        $process = new Process($command, $workingDir);
        $process->setTimeout(3600);
        
        $process->setEnv([
            'NODE_SKIP_PLATFORM_CHECK' => '1',
            'OPENSSL_CONF' => '',
            'SystemRoot' => getenv('SystemRoot'),
            'PATH' => getenv('PATH'),
            'LOCALAPPDATA' => getenv('LOCALAPPDATA'),
            'APPDATA' => getenv('APPDATA'),
            'USERPROFILE' => getenv('USERPROFILE'),
        ]);

        try {
            $process->mustRun();
            return $process->getOutput();
        } catch (ProcessFailedException $exception) {
            return json_encode([
                'status' => 'error',
                'message' => 'Erro na execução do script',
                'detail' => $exception->getMessage()
            ]);
        }
    }
}
