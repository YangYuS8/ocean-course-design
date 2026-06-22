<?php

namespace Tests\Feature;

use App\Models\InspectionTask;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskManagementTest extends TestCase
{
    use RefreshDatabase;

    /**
     * 准备已登录管理员请求头。
     *
     * 删除巡检任务属于受保护的业务操作，测试时也必须先登录，
     * 这样可以同时验证路由确实挂在 auth.simple 中间件后面。
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

    public function test_authenticated_user_can_update_inspection_task(): void
    {
        $headers = $this->authHeaders();

        $task = InspectionTask::query()->create([
            'title' => '写错的巡检任务',
            'area' => '错误海域',
            'inspector' => '旧负责人',
            'planned_date' => '2026-06-20',
            'description' => '这是一条需要修改的任务说明。',
        ]);

        $this->withHeaders($headers)
            ->putJson("/api/tasks/{$task->id}", [
                'title' => '修正后的巡检任务',
                'area' => '东湾 A 区',
                'inspector' => '张海宁',
                'planned_date' => '2026-06-22',
                'description' => '已修正任务区域、负责人和计划日期。',
            ])->assertOk()
            ->assertJsonPath('title', '修正后的巡检任务')
            ->assertJsonPath('area', '东湾 A 区')
            ->assertJsonPath('inspector', '张海宁')
            ->assertJsonPath('planned_date', '2026-06-22')
            ->assertJsonPath('description', '已修正任务区域、负责人和计划日期。');

        $this->assertDatabaseHas('inspection_tasks', [
            'id' => $task->id,
            'title' => '修正后的巡检任务',
            'area' => '东湾 A 区',
            'inspector' => '张海宁',
        ]);
    }

    public function test_authenticated_user_can_delete_inspection_task(): void
    {
        $headers = $this->authHeaders();

        $task = InspectionTask::query()->create([
            'title' => '待删除巡检任务',
            'area' => '临时测试海域',
            'inspector' => '测试员',
            'planned_date' => '2026-06-20',
            'description' => '用于验证删除接口的临时任务',
        ]);

        $this->withHeaders($headers)
            ->deleteJson("/api/tasks/{$task->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('inspection_tasks', ['id' => $task->id]);
    }
}
