<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InspectionTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'area',
        'planned_date',
        'status',
        'description',
        'started_at',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'planned_date' => 'date:Y-m-d',
            'started_at' => 'datetime:Y-m-d H:i:s',
            'submitted_at' => 'datetime:Y-m-d H:i:s',
        ];
    }

    public function samples(): HasMany
    {
        return $this->hasMany(Sample::class);
    }
}
