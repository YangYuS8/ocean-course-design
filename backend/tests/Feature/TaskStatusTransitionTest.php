<?php

namespace Tests\Feature;

use App\Models\InspectionTask;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskStatusTransitionTest extends TestCase
{
    use RefreshDatabase;

    /**
     * 准备已登录管理员请求头。
     *
     * 任务状态流转接口属于受保护业务接口，因此测试非法流转时也要先登录，
     * 保证失败原因来自业务规则，而不是未登录拦截。
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

    public function test_task_status_can_only_follow_expected_order(): void
    {
        $headers = $this->authHeaders();

        $task = InspectionTask::query()->create([
            'title' => '状态流转验证任务',
            'area' => '测试海域',
            'inspector' => '测试员',
            'planned_date' => '2026-06-21',
            'description' => '验证待开始、进行中、已提交之间的顺序。',
        ]);

        $this->withHeaders($headers)
            ->postJson("/api/tasks/{$task->id}/submit")
            ->assertStatus(422)
            ->assertJsonPath('message', '只有进行中的任务才能提交');

        $this->withHeaders($headers)
            ->postJson("/api/tasks/{$task->id}/start")
            ->assertOk()
            ->assertJsonPath('status', '进行中');

        $this->withHeaders($headers)
            ->postJson("/api/tasks/{$task->id}/start")
            ->assertStatus(422)
            ->assertJsonPath('message', '只有待开始的任务才能开始');

        $this->withHeaders($headers)
            ->postJson("/api/tasks/{$task->id}/submit")
            ->assertOk()
            ->assertJsonPath('status', '已提交');

        $this->withHeaders($headers)
            ->postJson("/api/tasks/{$task->id}/submit")
            ->assertStatus(422)
            ->assertJsonPath('message', '只有进行中的任务才能提交');
    }
}
