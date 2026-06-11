<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inspection_tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('area');
            $table->date('planned_date');
            $table->string('status')->default('待开始');
            $table->text('description')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });

        Schema::create('samples', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inspection_task_id')->constrained()->cascadeOnDelete();
            $table->string('code')->unique();
            $table->string('location');
            $table->timestamp('collected_at');
            $table->string('collector');
            $table->string('water_type')->default('海水');
            $table->string('status')->default('已登记');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('sample_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sample_id')->constrained()->cascadeOnDelete();
            $table->string('indicator');
            $table->decimal('value', 10, 2);
            $table->string('unit')->nullable();
            $table->decimal('standard_min', 10, 2)->nullable();
            $table->decimal('standard_max', 10, 2)->nullable();
            $table->boolean('is_abnormal')->default(false);
            $table->timestamp('tested_at');
            $table->string('tester');
            $table->timestamps();
        });

        Schema::create('exceptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sample_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('level')->default('中');
            $table->string('status')->default('待处理');
            $table->text('description');
            $table->text('resolution')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });

        Schema::create('analysis_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sample_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('已完成');
            $table->text('summary');
            $table->text('suggestion');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analysis_jobs');
        Schema::dropIfExists('exceptions');
        Schema::dropIfExists('sample_results');
        Schema::dropIfExists('samples');
        Schema::dropIfExists('inspection_tasks');
    }
};
