<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * 分析记录模型，对应 analysis_jobs 表。
 *
 * 本项目中的“分析”不是复杂 AI，而是根据检测结果和异常状态生成规则化建议。
 */
class AnalysisJob extends Model
{
    use HasFactory;

    /** 分析记录允许写入的字段。 */
    protected $fillable = [
        'sample_id',
        'status',
        'summary',
        'suggestion',
    ];

    /** 反向一对多：一条分析记录属于一个样本。 */
    public function sample(): BelongsTo
    {
        return $this->belongsTo(Sample::class);
    }
}
