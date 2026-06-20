<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * 巡检任务模型。
 *
 * Model（模型）对应数据库中的 inspection_tasks 表，负责描述“哪些字段可以批量写入”
 * 以及“它和其他表有什么关系”。这是 PHP/Laravel 课程中 ORM 的核心知识点。
 */
class InspectionTask extends Model
{
    use HasFactory;

    /**
     * 允许 create/update 批量赋值的字段。
     *
     * Laravel 默认会保护模型，只有放入 $fillable 的字段才能通过表单/API 写入，
     * 这样可以避免用户提交额外字段修改不该修改的数据。
     */
    protected $fillable = [
        'title',
        'area',
        'inspector',
        'planned_date',
        'status',
        'description',
        'started_at',
        'submitted_at',
    ];

    /**
     * 类型转换：把数据库字符串自动转成日期/时间对象，并在 JSON 中按指定格式输出。
     */
    protected function casts(): array
    {
        return [
            'planned_date' => 'date:Y-m-d',
            'started_at' => 'datetime:Y-m-d H:i:s',
            'submitted_at' => 'datetime:Y-m-d H:i:s',
        ];
    }

    /**
     * 一对多关系：一个巡检任务可以登记多个样本。
     */
    public function samples(): HasMany
    {
        return $this->hasMany(Sample::class);
    }
}
