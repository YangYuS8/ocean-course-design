<?php

namespace App\Http\Controllers;

use App\Models\Sample;
use Illuminate\Http\JsonResponse;

/** 分析控制器：根据样本检测结果生成简单的文字分析建议。 */
class AnalysisController extends Controller
{
    /**
     * 生成分析记录。
     *
     * 这里没有引入复杂算法，而是使用 if 判断和集合统计完成课程项目可理解的规则分析：
     * - 统计检测结果总数；
     * - 统计异常指标数量；
     * - 统计仍未处理的异常数量；
     * - 根据统计结果生成建议文字。
     */
    public function store(Sample $sample): JsonResponse
    {
        $sample->load(['results', 'exceptions']);

        $abnormalCount = $sample->results->where('is_abnormal', true)->count();
        $openExceptionCount = $sample->exceptions->where('status', '待处理')->count();

        $summary = "样本 {$sample->code} 共录入 {$sample->results->count()} 项检测结果，异常指标 {$abnormalCount} 项，待处理异常 {$openExceptionCount} 条。";
        $suggestion = $this->suggestion($abnormalCount, $openExceptionCount);
        $reportSummary = $this->reportSummary($sample, $abnormalCount, $openExceptionCount);

        $analysis = $sample->analyses()->create([
            'status' => '已完成',
            'summary' => $summary,
            'suggestion' => $suggestion,
            'report_summary' => $reportSummary,
        ]);

        return response()->json($analysis->load('sample:id,code,location'), 201);
    }

    /** 根据异常数量生成处置建议。 */
    private function suggestion(int $abnormalCount, int $openExceptionCount): string
    {
        if ($openExceptionCount > 0) {
            return '样本存在待处理异常，建议先完成异常处置，再安排复测确认。';
        }

        if ($abnormalCount > 0) {
            return '存在异常指标，建议复测并关注采样点附近排放情况。';
        }

        return '检测结果处于参考范围内，建议保持常规巡检频次。';
    }

    /**
     * 生成结构化报告摘要。
     *
     * 原版系统有报告导出和归档能力，课程简化版不引入 PDF/Word 生成库，
     * 但保留“报告摘要”这个轻量出口，让样本详情页能展示分析产出。
     */
    private function reportSummary(Sample $sample, int $abnormalCount, int $openExceptionCount): string
    {
        $weather = $sample->weather ?: '未记录';
        $coordinate = $sample->coordinate ?: '未记录';

        return "样本 {$sample->code}｜采样点：{$sample->location}｜采样人：{$sample->collector}｜天气：{$weather}｜坐标：{$coordinate}｜检测项：{$sample->results->count()}｜异常项：{$abnormalCount}｜待处理异常：{$openExceptionCount}";
    }
}
