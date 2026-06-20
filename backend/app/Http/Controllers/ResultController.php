<?php

namespace App\Http\Controllers;

use App\Models\Sample;
use App\Models\SampleException;
use App\Models\SampleResult;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** 检测结果控制器：录入指标，并判断是否超过参考范围。 */
class ResultController extends Controller
{
    /** 查询全部检测结果，并带上样本编号和采样点位，方便前端表格展示。 */
    public function index(): JsonResponse
    {
        return response()->json(
            SampleResult::with('sample:id,code,location')->latest()->get()
        );
    }

    /** 给某个样本新增一条检测结果。 */
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

        // 后端统一计算是否异常，避免前端随意传值导致数据不可信。
        $data['is_abnormal'] = $this->isAbnormal(
            (float) $data['value'],
            isset($data['standard_min']) ? (float) $data['standard_min'] : null,
            isset($data['standard_max']) ? (float) $data['standard_max'] : null,
        );

        $result = $sample->results()->create($data);
        $sample->update(['status' => $data['is_abnormal'] ? '发现异常' : '已检测']);

        // 如果检测值异常，自动生成一条待处理异常记录，让“检测结果 -> 异常处理”形成闭环。
        // firstOrCreate 可以避免同一样本同一指标重复录入时产生完全相同的异常标题。
        if ($data['is_abnormal']) {
            SampleException::query()->firstOrCreate(
                [
                    'sample_id' => $sample->id,
                    'title' => $data['indicator'].' 指标异常',
                ],
                [
                    'level' => '中',
                    'status' => '待处理',
                    'description' => $this->exceptionDescription($data),
                ],
            );
        }

        return response()->json($result->load('sample:id,code,location'), 201);
    }

    /** 判断检测值是否低于下限或高于上限。 */
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

    /** 生成异常描述，方便异常列表直接展示检测值和参考范围。 */
    private function exceptionDescription(array $data): string
    {
        $unit = $data['unit'] ?? '';
        $min = $data['standard_min'] ?? '未设置';
        $max = $data['standard_max'] ?? '未设置';

        return "检测指标 {$data['indicator']} 的结果为 {$data['value']}{$unit}，参考范围为 {$min} 至 {$max}，需要复核。";
    }
}
