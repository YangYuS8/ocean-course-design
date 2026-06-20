<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * 异常记录模型，对应 exceptions 表。
 *
 * 类名使用 SampleException，是为了避免和 PHP/Laravel 中的 Exception 异常类概念混淆；
 * 实际数据库表名仍然是 exceptions，所以这里用 $table 手动指定。
 */
class SampleException extends Model
{
    use HasFactory;

    /** 指定模型对应的数据表。 */
    protected $table = 'exceptions';

    /** 异常记录允许写入的字段。 */
    protected $fillable = [
        'sample_id',
        'title',
        'level',
        'status',
        'description',
        'resolution',
        'resolved_at',
    ];

    /** 把 resolved_at 转换为日期时间格式。 */
    protected function casts(): array
    {
        return [
            'resolved_at' => 'datetime:Y-m-d H:i:s',
        ];
    }

    /** 反向一对多：一条异常记录属于一个样本。 */
    public function sample(): BelongsTo
    {
        return $this->belongsTo(Sample::class);
    }
}
