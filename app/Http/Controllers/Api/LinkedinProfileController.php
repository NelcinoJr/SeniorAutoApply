<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Scraper\ScraperService;
use Illuminate\Http\Request;

class LinkedinProfileController extends Controller
{
    protected $scraperService;

    public function __construct(ScraperService $scraperService)
    {
        $this->scraperService = $scraperService;
    }

    public function show()
    {
        set_time_limit(120); // 2 minutes timeout for profile
        $output = $this->scraperService->runProfileScraper();
        
        // Output comes as string, we try to decode it
        $json = json_decode($output, true);

        if (json_last_error() === JSON_ERROR_NONE) {
            return response()->json($json);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Failed to parse scraper output',
            'raw_output' => $output
        ], 500);
    }
}
