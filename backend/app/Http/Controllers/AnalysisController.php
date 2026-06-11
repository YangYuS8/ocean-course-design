<?php

namespace App\Http\Controllers;

use App\Models\Sample;
use Illuminate\Http\JsonResponse;

class AnalysisController extends Controller
{
    public function store(Sample $sample): JsonResponse
    {
        $sample->load(['results', 'exceptions']);

        $abnormalCount = $sample->results->where('is_abnormal', true)->count();
        $openExceptionCount = $sample->exceptions->where('status', '待处理')->count();

        $summary = "样本 {$sample->code} 共录入 {$sample->results->count()} 项检测结果，异常指标 {$abnormalCount} 项。";
        $suggestion = $this->suggestion($abnormalCount, $openExceptionCount);

        $analysis = $sample->analyses()->create([
            'status' => '已完成',
            'summary' => $summary,
            'suggestion' => $suggestion,
        ]);

        return response()->json($analysis, 201);
    }

    private function suggestion(int $abnormalCount, int $openExceptionCount): string
    {
        if ($abnormalCount > 0 || $openExceptionCount > 0) {
            return '存在异常指标，建议复测并关注采样点附近排放情况。';
        }

        return '检测结果处于参考范围内，建议保持常规巡检频次。';
    }
}
