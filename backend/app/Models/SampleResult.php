<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SampleResult extends Model
{
    use HasFactory;

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

    public function sample(): BelongsTo
    {
        return $this->belongsTo(Sample::class);
    }
}
