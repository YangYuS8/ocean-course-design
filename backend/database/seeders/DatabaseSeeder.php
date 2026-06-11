<?php

namespace Database\Seeders;

use App\Models\AnalysisJob;
use App\Models\InspectionTask;
use App\Models\Sample;
use App\Models\SampleException;
use App\Models\SampleResult;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => '课程演示管理员',
            'email' => 'demo@example.com',
        ]);

        $task = InspectionTask::create([
            'title' => '港口近岸水质巡检',
            'area' => '北部港口海域',
            'planned_date' => '2026-06-10',
            'status' => '进行中',
            'description' => '用于课程答辩演示的基础巡检任务。',
            'started_at' => '2026-06-10 08:30:00',
        ]);

        $normalSample = Sample::create([
            'inspection_task_id' => $task->id,
            'code' => 'S-20260610-001',
            'location' => '港口一号采样点',
            'collected_at' => '2026-06-10 09:00:00',
            'collector' => '学生A',
            'water_type' => '海水',
            'status' => '已检测',
            'notes' => '天气晴，海面平稳。',
        ]);

        $abnormalSample = Sample::create([
            'inspection_task_id' => $task->id,
            'code' => 'S-20260610-002',
            'location' => '排水口附近采样点',
            'collected_at' => '2026-06-10 09:40:00',
            'collector' => '学生B',
            'water_type' => '海水',
            'status' => '异常待处理',
            'notes' => '水体有轻微异味。',
        ]);

        Sample::create([
            'inspection_task_id' => $task->id,
            'code' => 'S-20260610-003',
            'location' => '外海对照采样点',
            'collected_at' => '2026-06-10 10:05:00',
            'collector' => '学生A',
            'water_type' => '海水',
            'status' => '已登记',
            'notes' => '等待检测结果录入。',
        ]);

        SampleResult::create([
            'sample_id' => $normalSample->id,
            'indicator' => 'pH',
            'value' => 8.1,
            'unit' => 'pH',
            'standard_min' => 7.8,
            'standard_max' => 8.5,
            'is_abnormal' => false,
            'tested_at' => '2026-06-10 10:20:00',
            'tester' => '学生C',
        ]);

        SampleResult::create([
            'sample_id' => $normalSample->id,
            'indicator' => '溶解氧',
            'value' => 6.4,
            'unit' => 'mg/L',
            'standard_min' => 5.0,
            'standard_max' => null,
            'is_abnormal' => false,
            'tested_at' => '2026-06-10 10:35:00',
            'tester' => '学生C',
        ]);

        SampleResult::create([
            'sample_id' => $abnormalSample->id,
            'indicator' => '氨氮',
            'value' => 1.8,
            'unit' => 'mg/L',
            'standard_min' => 0,
            'standard_max' => 1.0,
            'is_abnormal' => true,
            'tested_at' => '2026-06-10 11:00:00',
            'tester' => '学生D',
        ]);

        SampleException::create([
            'sample_id' => $abnormalSample->id,
            'title' => '氨氮指标偏高',
            'level' => '中',
            'status' => '待处理',
            'description' => '排水口附近样本氨氮超过参考上限，需要复测并记录现场情况。',
        ]);

        AnalysisJob::create([
            'sample_id' => $normalSample->id,
            'status' => '已完成',
            'summary' => '样本 S-20260610-001 共录入 2 项检测结果，异常指标 0 项。',
            'suggestion' => '检测结果处于参考范围内，建议保持常规巡检频次。',
        ]);
    }
}
