<?php

namespace App\Http\Controllers;

use App\Models\Sample;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** 样本控制器：负责样本登记、样本列表和样本详情。 */
class SampleController extends Controller
{
    /** 查询样本列表，并通过 with 预加载所属任务，减少数据库查询次数。 */
    public function index(): JsonResponse
    {
        return response()->json(
            Sample::with('task:id,title,area,inspector,status')->latest()->get()
        );
    }

    /** 登记采样样本。 */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'inspection_task_id' => ['required', 'exists:inspection_tasks,id'],
            'code' => ['required', 'string', 'max:60', 'unique:samples,code'],
            'location' => ['required', 'string', 'max:120'],
            'collected_at' => ['required', 'date'],
            'collector' => ['required', 'string', 'max:60'],
            'water_type' => ['nullable', 'string', 'max:60'],
            'weather' => ['nullable', 'string', 'max:60'],
            'coordinate' => ['nullable', 'string', 'max:120'],
            'notes' => ['nullable', 'string'],
        ]);

        $sample = Sample::create($data);

        return response()->json($sample->refresh()->load('task:id,title,area,inspector,status'), 201);
    }

    /** 查看某个样本的完整信息：任务、检测结果、异常、分析建议。 */
    public function show(Sample $sample): JsonResponse
    {
        return response()->json(
            $sample->load([
                'task:id,title,area,inspector,status',
                'results',
                'exceptions',
                'analyses',
            ])
        );
    }
}
