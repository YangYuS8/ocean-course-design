<?php

namespace App\Http\Controllers;

use App\Models\AnalysisJob;
use App\Models\InspectionTask;
use App\Models\Sample;
use App\Models\SampleException;
use App\Models\SampleResult;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json([
            'business_chain' => ['巡检任务', '样本登记', '检测结果', '异常处理', '分析建议', '首页统计'],
            'statistics' => [
                'tasks_total' => InspectionTask::count(),
                'tasks_in_progress' => InspectionTask::where('status', '进行中')->count(),
                'samples_total' => Sample::count(),
                'results_total' => SampleResult::count(),
                'open_exceptions' => SampleException::where('status', '待处理')->count(),
                'analysis_total' => AnalysisJob::count(),
            ],
            'recent_tasks' => InspectionTask::latest()->limit(5)->get(),
            'recent_exceptions' => SampleException::with('sample:id,code,location')
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }
}
