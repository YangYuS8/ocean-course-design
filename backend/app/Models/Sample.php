<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * 样本模型，对应 samples 表。
 *
 * 样本是业务链中的核心数据：一个样本属于一个巡检任务，后续会挂载检测结果、异常记录和分析建议。
 */
class Sample extends Model
{
    use HasFactory;

    /** 允许批量写入的字段。 */
    protected $fillable = [
        'inspection_task_id',
        'code',
        'location',
        'collected_at',
        'collector',
        'water_type',
        'status',
        'notes',
    ];

    /** 把 collected_at 自动转换为日期时间格式，返回 JSON 时更统一。 */
    protected function casts(): array
    {
        return [
            'collected_at' => 'datetime:Y-m-d H:i:s',
        ];
    }

    /** 反向一对多：一个样本属于一个巡检任务。 */
    public function task(): BelongsTo
    {
        return $this->belongsTo(InspectionTask::class, 'inspection_task_id');
    }

    /** 一对多：一个样本可以有多条检测结果。 */
    public function results(): HasMany
    {
        return $this->hasMany(SampleResult::class);
    }

    /** 一对多：一个样本可以有多条异常记录。 */
    public function exceptions(): HasMany
    {
        return $this->hasMany(SampleException::class);
    }

    /** 一对多：一个样本可以多次生成分析建议。 */
    public function analyses(): HasMany
    {
        return $this->hasMany(AnalysisJob::class);
    }
}
