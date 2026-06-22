<?php

namespace Tests\Feature;

use App\Models\InspectionTask;
use App\Models\Sample;
use App\Models\SampleResult;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SampleResultManagementTest extends TestCase
{
    use RefreshDatabase;

    /**
     * 准备登录请求头。
     *
     * 样本和检测结果的增删改查都属于受保护业务接口，测试时先登录，
     * 可以确保后续断言关注的是 CRUD 行为本身。
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

    private function createTask(): InspectionTask
    {
        return InspectionTask::query()->create([
            'title' => 'CRUD 验证巡检任务',
            'area' => '测试海域',
            'inspector' => '测试员',
            'planned_date' => '2026-06-23',
            'description' => '用于验证样本和检测结果的修改删除。',
        ]);
    }

    public function test_authenticated_user_can_update_and_delete_sample(): void
    {
        $headers = $this->authHeaders();
        $task = $this->createTask();

        $sample = Sample::query()->create([
            'inspection_task_id' => $task->id,
            'code' => 'S-CRUD-001',
            'location' => '错误点位',
            'collected_at' => '2026-06-23 09:00:00',
            'collector' => '旧采样人',
            'water_type' => '海水',
            'weather' => '晴',
            'coordinate' => '121.00,38.00',
            'notes' => '待修正样本。',
        ]);

        $this->withHeaders($headers)
            ->putJson("/api/samples/{$sample->id}", [
                'inspection_task_id' => $task->id,
                'code' => 'S-CRUD-002',
                'location' => '东湾修正点位',
                'collected_at' => '2026-06-23 10:00:00',
                'collector' => '李珊',
                'water_type' => '近岸海水',
                'weather' => '多云',
                'coordinate' => '121.48,38.92',
                'notes' => '已修正样本信息。',
            ])->assertOk()
            ->assertJsonPath('code', 'S-CRUD-002')
            ->assertJsonPath('location', '东湾修正点位')
            ->assertJsonPath('collector', '李珊');

        $this->assertDatabaseHas('samples', [
            'id' => $sample->id,
            'code' => 'S-CRUD-002',
            'location' => '东湾修正点位',
        ]);

        $this->withHeaders($headers)
            ->deleteJson("/api/samples/{$sample->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('samples', ['id' => $sample->id]);
    }

    public function test_authenticated_user_can_update_and_delete_sample_result(): void
    {
        $headers = $this->authHeaders();
        $task = $this->createTask();
        $sample = Sample::query()->create([
            'inspection_task_id' => $task->id,
            'code' => 'S-RESULT-001',
            'location' => '检测点位',
            'collected_at' => '2026-06-23 09:00:00',
            'collector' => '李珊',
        ]);
        $result = SampleResult::query()->create([
            'sample_id' => $sample->id,
            'indicator' => 'pH',
            'value' => 9.1,
            'unit' => 'pH',
            'standard_min' => 7.8,
            'standard_max' => 8.5,
            'is_abnormal' => true,
            'tested_at' => '2026-06-23 10:00:00',
            'tester' => '旧检测员',
        ]);

        $this->withHeaders($headers)
            ->putJson("/api/results/{$result->id}", [
                'sample_id' => $sample->id,
                'indicator' => '溶解氧',
                'value' => 6.5,
                'unit' => 'mg/L',
                'standard_min' => 5,
                'standard_max' => null,
                'tested_at' => '2026-06-23 11:00:00',
                'tester' => '陈一鸣',
            ])->assertOk()
            ->assertJsonPath('indicator', '溶解氧')
            ->assertJsonPath('is_abnormal', false)
            ->assertJsonPath('tester', '陈一鸣');

        $this->assertDatabaseHas('sample_results', [
            'id' => $result->id,
            'indicator' => '溶解氧',
            'tester' => '陈一鸣',
            'is_abnormal' => false,
        ]);
        $this->assertDatabaseHas('samples', [
            'id' => $sample->id,
            'status' => '已检测',
        ]);

        $this->withHeaders($headers)
            ->deleteJson("/api/results/{$result->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('sample_results', ['id' => $result->id]);
        $this->assertDatabaseHas('samples', [
            'id' => $sample->id,
            'status' => '已登记',
        ]);
    }
}
