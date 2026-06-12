<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DemoFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_core_business_flow(): void
    {
        $this->seed();

        $this->getJson('/api/dashboard')
            ->assertOk()
            ->assertJsonPath('business_chain.0', '巡检任务')
            ->assertJsonStructure([
                'statistics' => [
                    'tasks_total',
                    'tasks_in_progress',
                    'samples_total',
                    'results_total',
                    'open_exceptions',
                    'analysis_total',
                ],
            ]);

        $taskId = $this->postJson('/api/tasks', [
            'title' => '近岸海水例行巡检',
            'area' => '东部近岸站点',
            'planned_date' => '2026-06-12',
            'description' => '近岸海域例行巡检任务',
        ])->assertCreated()
            ->assertJsonPath('status', '待开始')
            ->json('id');

        $this->postJson("/api/tasks/{$taskId}/start")
            ->assertOk()
            ->assertJsonPath('status', '进行中');

        $sampleId = $this->postJson('/api/samples', [
            'inspection_task_id' => $taskId,
            'code' => 'S-DEMO-001',
            'location' => '一号采样点',
            'collected_at' => '2026-06-12 09:30:00',
            'collector' => '学生A',
            'water_type' => '海水',
            'notes' => '水体略浑浊',
        ])->assertCreated()
            ->assertJsonPath('status', '已登记')
            ->json('id');

        $this->postJson("/api/samples/{$sampleId}/results", [
            'indicator' => 'pH',
            'value' => 8.9,
            'unit' => 'pH',
            'standard_min' => 7.8,
            'standard_max' => 8.5,
            'tested_at' => '2026-06-12 10:15:00',
            'tester' => '学生B',
        ])->assertCreated()
            ->assertJsonPath('is_abnormal', true);

        $exceptionId = $this->postJson('/api/exceptions', [
            'sample_id' => $sampleId,
            'title' => 'pH 超过参考上限',
            'level' => '中',
            'description' => '样本 pH 检测值偏高，需要复核。',
        ])->assertCreated()
            ->assertJsonPath('status', '待处理')
            ->json('id');

        $this->postJson("/api/exceptions/{$exceptionId}/resolve", [
            'resolution' => '已安排复测并记录现场情况。',
        ])->assertOk()
            ->assertJsonPath('status', '已处理');

        $this->postJson("/api/samples/{$sampleId}/analyze")
            ->assertCreated()
            ->assertJsonPath('status', '已完成')
            ->assertJsonPath('suggestion', '存在异常指标，建议复测并关注采样点附近排放情况。');

        $this->postJson("/api/tasks/{$taskId}/submit")
            ->assertOk()
            ->assertJsonPath('status', '已提交');

        $this->getJson('/api/dashboard')
            ->assertOk()
            ->assertJsonPath('statistics.samples_total', 4)
            ->assertJsonPath('statistics.results_total', 4)
            ->assertJsonPath('statistics.open_exceptions', 1)
            ->assertJsonPath('statistics.analysis_total', 2);
    }
}
