<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * 检测结果模型，对应 sample_results 表。
 *
 * 每条记录表示某个样本的一项检测指标，例如 pH、溶解氧、氨氮等。
 */
class SampleResult extends Model
{
    use HasFactory;

    /** 检测结果允许写入的字段。 */
    protected $fillable = [
        'sample_id',
        'indicator',
        'value',
        'unit',
        'standard_min',
        'standard_max',
        'is_abnormal',
        'tested_at',
        'tester',
    ];

    /** 类型转换：数值转 float，异常标记转 boolean，检测时间转日期时间。 */
    protected function casts(): array
    {
        return [
            'value' => 'float',
            'standard_min' => 'float',
            'standard_max' => 'float',
            'is_abnormal' => 'boolean',
            'tested_at' => 'datetime:Y-m-d H:i:s',
        ];
    }

    /** 反向一对多：一条检测结果属于一个样本。 */
    public function sample(): BelongsTo
    {
        return $this->belongsTo(Sample::class);
    }
}
