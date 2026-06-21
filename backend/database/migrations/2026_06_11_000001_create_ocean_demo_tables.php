<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 执行数据库迁移。
     *
     * 迁移（Migration）是 Laravel 中用于“用 PHP 代码管理数据表结构”的课程重点：
     * - Schema::create 用来创建表；
     * - Blueprint $table 用来描述字段；
     * - foreignId(...)->constrained() 用来建立外键关系；
     * - timestamps() 自动生成 created_at / updated_at，方便记录数据变化时间。
     */
    public function up(): void
    {
        // 巡检任务表：一条任务可以包含多个采样样本，是业务流程的起点。
        Schema::create('inspection_tasks', function (Blueprint $table) {
            $table->id(); // 自增主键 id
            $table->string('title'); // 任务名称，例如“港口近岸水质巡检”
            $table->string('area'); // 巡检区域
            $table->string('inspector')->default('未分配'); // 负责人/巡检员，便于页面展示任务归属
            $table->date('planned_date'); // 计划巡检日期
            $table->string('status')->default('待开始'); // 状态：待开始、进行中、已提交
            $table->text('description')->nullable(); // 任务说明，nullable 表示可以为空
            $table->timestamp('started_at')->nullable(); // 开始时间
            $table->timestamp('submitted_at')->nullable(); // 提交时间
            $table->timestamps();
        });

        // 样本表：每个样本必须属于一个巡检任务，因此使用 inspection_task_id 外键。
        Schema::create('samples', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inspection_task_id')->constrained()->cascadeOnDelete(); // 任务删除时同步删除样本
            $table->string('code')->unique(); // 样本编号必须唯一，避免同一编号重复登记
            $table->string('location'); // 采样点位
            $table->timestamp('collected_at'); // 采样时间
            $table->string('collector'); // 采样人
            $table->string('water_type')->default('海水'); // 水体类型
            $table->string('weather')->nullable(); // 现场天气，保留原版“环境参数”的轻量表达
            $table->string('coordinate')->nullable(); // 采样坐标，保留原版“定位采样”的轻量表达
            $table->string('status')->default('已登记'); // 样本状态
            $table->text('notes')->nullable(); // 现场备注
            $table->timestamps();
        });

        // 检测结果表：一个样本可以录入多项指标，例如 pH、溶解氧、氨氮等。
        Schema::create('sample_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sample_id')->constrained()->cascadeOnDelete();
            $table->string('indicator'); // 指标名称
            $table->decimal('value', 10, 2); // 检测值，decimal 适合保存精确小数
            $table->string('unit')->nullable(); // 单位，例如 mg/L
            $table->decimal('standard_min', 10, 2)->nullable(); // 参考下限
            $table->decimal('standard_max', 10, 2)->nullable(); // 参考上限
            $table->boolean('is_abnormal')->default(false); // 是否异常，由后端根据阈值计算
            $table->timestamp('tested_at'); // 检测时间
            $table->string('tester'); // 检测人
            $table->timestamps();
        });

        // 异常表：记录样本异常及处理结果。
        Schema::create('exceptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sample_id')->constrained()->cascadeOnDelete();
            $table->string('title'); // 异常标题
            $table->string('level')->default('中'); // 异常等级：低、中、高
            $table->string('status')->default('待处理'); // 处理状态
            $table->text('description'); // 异常说明
            $table->text('resolution')->nullable(); // 处理说明
            $table->timestamp('resolved_at')->nullable(); // 处理完成时间
            $table->timestamps();
        });

        // 分析记录表：保存系统根据检测结果生成的文字分析建议。
        Schema::create('analysis_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sample_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('已完成');
            $table->text('summary'); // 分析摘要
            $table->text('suggestion'); // 处置建议
            $table->text('report_summary')->nullable(); // 面向样本详情页展示的结构化报告摘要
            $table->timestamps();
        });
    }

    /**
     * 回滚迁移。
     *
     * 删除表时要按“从表到主表”的顺序删除：先删依赖 samples 的分析/异常/结果，
     * 再删 samples，最后删 inspection_tasks，否则外键约束会阻止删除。
     */
    public function down(): void
    {
        Schema::dropIfExists('analysis_jobs');
        Schema::dropIfExists('exceptions');
        Schema::dropIfExists('sample_results');
        Schema::dropIfExists('samples');
        Schema::dropIfExists('inspection_tasks');
    }
};
