<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sample extends Model
{
    use HasFactory;

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

    protected function casts(): array
    {
        return [
            'collected_at' => 'datetime:Y-m-d H:i:s',
        ];
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(InspectionTask::class, 'inspection_task_id');
    }

    public function results(): HasMany
    {
        return $this->hasMany(SampleResult::class);
    }

    public function exceptions(): HasMany
    {
        return $this->hasMany(SampleException::class);
    }

    public function analyses(): HasMany
    {
        return $this->hasMany(AnalysisJob::class);
    }
}
