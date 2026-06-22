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
        $data = $this->validatedData($request);

        $data['is_abnormal'] = $this->isAbnormalFromData($data);

        $result = $sample->results()->create($data);
        $this->refreshSampleStatus($sample);

        // 如果检测值异常，自动生成一条待处理异常记录，让“检测结果 -> 异常处理”形成闭环。
        // firstOrCreate 可以避免同一样本同一指标重复录入时产生完全相同的异常标题。
        if ($data['is_abnormal']) {
            $this->ensureException($sample, $data);
        }

        return response()->json($result->load('sample:id,code,location'), 201);
    }

    /** 修改检测结果。 */
    public function update(Request $request, SampleResult $result): JsonResponse
    {
        // 检测结果修改用于修正实验录入错误，体现数据库 CRUD 中的 Update 操作。
        // 是否异常仍由后端根据参考上下限重新计算，避免前端直接伪造异常状态。
        $data = $this->validatedData($request, true);
        $sample = Sample::query()->findOrFail($data['sample_id']);
        $data['is_abnormal'] = $this->isAbnormalFromData($data);

        $oldSample = $result->sample;
        $result->update($data);
        $this->refreshSampleStatus($sample);
        if ($oldSample && $oldSample->id !== $sample->id) {
            $this->refreshSampleStatus($oldSample);
        }

        if ($data['is_abnormal']) {
            $this->ensureException($sample, $data);
        }

        return response()->json($result->fresh()->load('sample:id,code,location'));
    }

    /** 删除检测结果。 */
    public function destroy(SampleResult $result): JsonResponse
    {
        // 删除检测结果只移除本条检测记录；异常记录是否保留给异常处理模块判断，
        // 这样课程演示时可以说明“检测记录”和“异常处置记录”是两类表。
        $sample = $result->sample;
        $result->delete();

        if ($sample) {
            $this->refreshSampleStatus($sample);
        }

        return response()->json(null, 204);
    }

    /** 检测结果创建和修改共用的校验逻辑。 */
    private function validatedData(Request $request, bool $includeSample = false): array
    {
        $rules = [
            'indicator' => ['required', 'string', 'max:80'],
            'value' => ['required', 'numeric'],
            'unit' => ['nullable', 'string', 'max:40'],
            'standard_min' => ['nullable', 'numeric'],
            'standard_max' => ['nullable', 'numeric'],
            'tested_at' => ['required', 'date'],
            'tester' => ['required', 'string', 'max:60'],
        ];

        if ($includeSample) {
            $rules['sample_id'] = ['required', 'exists:samples,id'];
        }

        return $request->validate($rules);
    }

    /** 根据检测数据统一计算是否异常。 */
    private function isAbnormalFromData(array $data): bool
    {
        return $this->isAbnormal(
            (float) $data['value'],
            isset($data['standard_min']) ? (float) $data['standard_min'] : null,
            isset($data['standard_max']) ? (float) $data['standard_max'] : null,
        );
    }

    /** 异常检测结果自动生成待处理异常记录。 */
    private function ensureException(Sample $sample, array $data): void
    {
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

    /** 根据当前检测结果重新计算样本状态。 */
    private function refreshSampleStatus(Sample $sample): void
    {
        // 检测结果被修改或删除后，样本状态也必须同步更新：
        // 没有结果回到“已登记”，有任意异常为“发现异常”，其余情况为“已检测”。
        if (! $sample->results()->exists()) {
            $sample->update(['status' => '已登记']);

            return;
        }

        $sample->update([
            'status' => $sample->results()->where('is_abnormal', true)->exists() ? '发现异常' : '已检测',
        ]);
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
