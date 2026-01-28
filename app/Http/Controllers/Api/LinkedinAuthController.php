<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Scraper\ScraperService;
use Illuminate\Http\Request;

class LinkedinAuthController extends Controller
{
    protected $scraperService;

    public function __construct(ScraperService $scraperService)
    {
        $this->scraperService = $scraperService;
    }

    public function login()
    {
        set_time_limit(600); // 10 minutes for login process
        
        $output = $this->scraperService->runLoginScraper();
        
        $json = json_decode($output, true);

        if (json_last_error() === JSON_ERROR_NONE) {
            return response()->json($json);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Failed to parse login output',
            'raw_output' => $output
        ], 500);
    }
}
