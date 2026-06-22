<?php

namespace App\Http\Controllers;

use App\Models\InspectionTask;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * 巡检任务控制器。
 *
 * Controller（控制器）负责接收 HTTP 请求、校验表单数据、调用模型读写数据库，
 * 最后返回 JSON 给前端。这里体现了 PHP Web 开发中的“路由 -> 控制器 -> 模型 -> 数据库”流程。
 */
class TaskController extends Controller
{
    /** 查询任务列表，并附带每个任务下面的样本数量。 */
    public function index(): JsonResponse
    {
        return response()->json(
            InspectionTask::withCount('samples')->latest()->get()
        );
    }

    /** 新建巡检任务。 */
    public function store(Request $request): JsonResponse
    {
        // validate 会自动检查请求参数；不符合规则时 Laravel 会返回 422 JSON 错误。
        $data = $request->validate([
            'title' => ['required', 'string', 'max:120'],
            'area' => ['required', 'string', 'max:120'],
            'inspector' => ['required', 'string', 'max:60'],
            'planned_date' => ['required', 'date'],
            'description' => ['nullable', 'string'],
        ]);

        $task = InspectionTask::create($data);

        return response()->json($task->refresh(), 201);
    }

    /** 将任务状态改为进行中。 */
    public function start(InspectionTask $task): JsonResponse
    {
        // 路由模型绑定会根据 {task} 自动查询 InspectionTask，找不到时返回 404。
        // 简化版虽然不做复杂状态机，但仍要保护最基本的业务顺序：只能从“待开始”进入“进行中”。
        if ($task->status !== '待开始') {
            return response()->json(['message' => '只有待开始的任务才能开始'], 422);
        }

        $task->update([
            'status' => '进行中',
            'started_at' => now(),
        ]);

        return response()->json($task->fresh());
    }

    /** 提交任务，表示本次巡检流程已完成录入。 */
    public function submit(InspectionTask $task): JsonResponse
    {
        // 只能提交已经开始的任务，避免前端禁用按钮被绕过后直接把未开始任务标记完成。
        if ($task->status !== '进行中') {
            return response()->json(['message' => '只有进行中的任务才能提交'], 422);
        }

        $task->update([
            'status' => '已提交',
            'submitted_at' => now(),
        ]);

        return response()->json($task->fresh());
    }

    /** 删除巡检任务。 */
    public function destroy(InspectionTask $task): JsonResponse
    {
        // 迁移文件中 samples.inspection_task_id 使用了 cascadeOnDelete，
        // 因此删除任务时，任务下面的样本以及样本关联的检测结果、异常和分析记录会被数据库级联删除。
        // 这符合“删除任务就是删除整条巡检链路数据”的页面语义，避免留下孤立样本。
        $task->delete();

        return response()->json(null, 204);
    }
}
