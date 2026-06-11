<?php

namespace App\Http\Controllers;

use App\Models\Sample;
use App\Models\SampleResult;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResultController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            SampleResult::with('sample:id,code,location')->latest()->get()
        );
    }

    public function store(Request $request, Sample $sample): JsonResponse
    {
        $data = $request->validate([
            'indicator' => ['required', 'string', 'max:80'],
            'value' => ['required', 'numeric'],
            'unit' => ['nullable', 'string', 'max:40'],
            'standard_min' => ['nullable', 'numeric'],
            'standard_max' => ['nullable', 'numeric'],
            'tested_at' => ['required', 'date'],
            'tester' => ['required', 'string', 'max:60'],
        ]);

        $data['is_abnormal'] = $this->isAbnormal(
            (float) $data['value'],
            isset($data['standard_min']) ? (float) $data['standard_min'] : null,
            isset($data['standard_max']) ? (float) $data['standard_max'] : null,
        );

        $result = $sample->results()->create($data);
        $sample->update(['status' => $data['is_abnormal'] ? '发现异常' : '已检测']);

        return response()->json($result, 201);
    }

    private function isAbnormal(float $value, ?float $min, ?float $max): bool
    {
        if ($min !== null && $value < $min) {
            return true;
        }

        if ($max !== null && $value > $max) {
            return true;
        }

        return false;
    }
}
