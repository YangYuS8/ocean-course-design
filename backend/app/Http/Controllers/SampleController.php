<?php

namespace App\Http\Controllers;

use App\Models\Sample;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

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
        $data = $request->validate($this->rules());

        $sample = Sample::create($data);

        return response()->json($sample->refresh()->load('task:id,title,area,inspector,status'), 201);
    }

    /** 修改样本基础信息。 */
    public function update(Request $request, Sample $sample): JsonResponse
    {
        // 样本修改用于修正现场登记错误，体现数据库 CRUD 中的 Update 操作。
        // code 仍然保持唯一，但允许当前样本继续使用自己的编号。
        $data = $request->validate($this->rules($sample));

        $sample->update($data);

        return response()->json($sample->fresh()->load('task:id,title,area,inspector,status'));
    }

    /** 删除样本。 */
    public function destroy(Sample $sample): JsonResponse
    {
        // 迁移中 sample_results、exceptions、analysis_jobs 都对 sample_id 设置了级联删除。
        // 因此删除样本时，会同步清理该样本下的检测结果、异常和分析记录，避免孤立数据。
        $sample->delete();

        return response()->json(null, 204);
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

    /** 样本创建和修改共用的校验规则。 */
    private function rules(?Sample $sample = null): array
    {
        return [
            'inspection_task_id' => ['required', 'exists:inspection_tasks,id'],
            'code' => ['required', 'string', 'max:60', Rule::unique('samples', 'code')->ignore($sample?->id)],
            'location' => ['required', 'string', 'max:120'],
            'collected_at' => ['required', 'date'],
            'collector' => ['required', 'string', 'max:60'],
            'water_type' => ['nullable', 'string', 'max:60'],
            'weather' => ['nullable', 'string', 'max:60'],
            'coordinate' => ['nullable', 'string', 'max:120'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
