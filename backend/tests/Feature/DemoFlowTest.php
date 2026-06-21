<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DemoFlowTest extends TestCase
{
    use RefreshDatabase;

    /**
     * 准备登录请求头。
     *
     * 业务接口已经受中间件保护，因此测试完整流程时也必须先登录获取 token，
     * 这能证明“登录”不是前端摆设，而是真正参与后端接口访问控制。
     */
    private function authHeaders(): array
    {
        $this->seed();

        $token = $this->postJson('/api/login', [
            'email' => 'admin@ocean.local',
            'password' => 'password',
        ])->assertOk()->json('token');

        return ['Authorization' => 'Bearer '.$token];
    }

    public function test_core_business_flow(): void
    {
        $headers = $this->authHeaders();

        $this->getJson('/api/dashboard')->assertUnauthorized();

        $this->withHeaders($headers)->getJson('/api/dashboard')
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
                'abnormal_results',
                'recent_analyses',
            ]);

        $taskId = $this->withHeaders($headers)->postJson('/api/tasks', [
            'title' => '近岸海水例行巡检',
            'area' => '东部近岸站点',
            'inspector' => '张海宁',
            'planned_date' => '2026-06-12',
            'description' => '近岸海域例行巡检任务',
        ])->assertCreated()
            ->assertJsonPath('status', '待开始')
            ->assertJsonPath('inspector', '张海宁')
            ->json('id');

        $this->withHeaders($headers)->postJson("/api/tasks/{$taskId}/start")
            ->assertOk()
            ->assertJsonPath('status', '进行中');

        $sampleId = $this->withHeaders($headers)->postJson('/api/samples', [
            'inspection_task_id' => $taskId,
            'code' => 'S-DEMO-001',
            'location' => '一号采样点',
            'collected_at' => '2026-06-12 09:30:00',
            'collector' => '李珊',
            'water_type' => '海水',
            'weather' => '多云',
            'coordinate' => '121.48,38.92',
            'notes' => '水体略浑浊',
        ])->assertCreated()
            ->assertJsonPath('status', '已登记')
            ->assertJsonPath('weather', '多云')
            ->assertJsonPath('coordinate', '121.48,38.92')
            ->json('id');

        $this->withHeaders($headers)->postJson("/api/samples/{$sampleId}/results", [
            'indicator' => 'pH',
            'value' => 8.9,
            'unit' => 'pH',
            'standard_min' => 7.8,
            'standard_max' => 8.5,
            'tested_at' => '2026-06-12 10:15:00',
            'tester' => '陈一鸣',
        ])->assertCreated()
            ->assertJsonPath('is_abnormal', true);

        $this->withHeaders($headers)->getJson('/api/exceptions')
            ->assertOk()
            ->assertJsonFragment(['title' => 'pH 指标异常']);

        $exceptionId = $this->withHeaders($headers)->postJson('/api/exceptions', [
            'sample_id' => $sampleId,
            'title' => 'pH 超过参考上限',
            'level' => '中',
            'description' => '样本 pH 检测值偏高，需要复核。',
        ])->assertCreated()
            ->assertJsonPath('status', '待处理')
            ->json('id');

        $this->withHeaders($headers)->postJson("/api/exceptions/{$exceptionId}/resolve", [
            'resolution' => '已安排复测并记录现场情况。',
        ])->assertOk()
            ->assertJsonPath('status', '已处理');

        $this->withHeaders($headers)->postJson("/api/samples/{$sampleId}/analyze")
            ->assertCreated()
            ->assertJsonPath('status', '已完成')
            ->assertJsonPath('suggestion', '样本存在待处理异常，建议先完成异常处置，再安排复测确认。')
            ->assertJsonPath('report_summary', "样本 S-DEMO-001｜采样点：一号采样点｜采样人：李珊｜天气：多云｜坐标：121.48,38.92｜检测项：1｜异常项：1｜待处理异常：1");

        $this->withHeaders($headers)->getJson("/api/samples/{$sampleId}")
            ->assertOk()
            ->assertJsonPath('weather', '多云')
            ->assertJsonPath('coordinate', '121.48,38.92')
            ->assertJsonPath('analyses.0.report_summary', "样本 S-DEMO-001｜采样点：一号采样点｜采样人：李珊｜天气：多云｜坐标：121.48,38.92｜检测项：1｜异常项：1｜待处理异常：1");

        $this->withHeaders($headers)->postJson("/api/tasks/{$taskId}/submit")
            ->assertOk()
            ->assertJsonPath('status', '已提交');

        $this->withHeaders($headers)->getJson('/api/dashboard')
            ->assertOk()
            ->assertJsonPath('statistics.samples_total', 4)
            ->assertJsonPath('statistics.results_total', 4)
            ->assertJsonPath('statistics.open_exceptions', 2)
            ->assertJsonPath('statistics.analysis_total', 2);
    }
}
