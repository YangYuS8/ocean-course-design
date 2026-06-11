<?php

namespace App\Http\Controllers;

use App\Models\Sample;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SampleController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Sample::with('task:id,title,area,status')->latest()->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'inspection_task_id' => ['required', 'exists:inspection_tasks,id'],
            'code' => ['required', 'string', 'max:60', 'unique:samples,code'],
            'location' => ['required', 'string', 'max:120'],
            'collected_at' => ['required', 'date'],
            'collector' => ['required', 'string', 'max:60'],
            'water_type' => ['nullable', 'string', 'max:60'],
            'notes' => ['nullable', 'string'],
        ]);

        $sample = Sample::create($data);

        return response()->json($sample->refresh(), 201);
    }

    public function show(Sample $sample): JsonResponse
    {
        return response()->json(
            $sample->load([
                'task:id,title,area,status',
                'results',
                'exceptions',
                'analyses',
            ])
        );
    }
}
