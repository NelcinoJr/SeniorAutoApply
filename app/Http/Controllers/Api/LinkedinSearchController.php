<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Scraper\ScraperService;
use Illuminate\Http\Request;

class LinkedinSearchController extends Controller
{
    protected $scraperService;

    public function __construct(ScraperService $scraperService)
    {
        $this->scraperService = $scraperService;
    }

    public function search(Request $request)
    {
        set_time_limit(300); // 5 minutes timeout for scraper

        $request->validate([
            'keywords' => 'required|string',
            'location' => 'nullable|string',
        ]);

        $keywords = $request->input('keywords');
        $location = $request->input('location', '');

        $output = $this->scraperService->runSearchScraper($keywords, $location);
        
        $json = json_decode($output, true);

        if (json_last_error() === JSON_ERROR_NONE) {
            return response()->json($json);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Failed to parse search output',
            'raw_output' => $output
        ], 500);
    }
}
