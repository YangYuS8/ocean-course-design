<?php

namespace App\Http\Controllers;

use App\Models\InspectionTask;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            InspectionTask::withCount('samples')->latest()->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:120'],
            'area' => ['required', 'string', 'max:120'],
            'planned_date' => ['required', 'date'],
            'description' => ['nullable', 'string'],
        ]);

        $task = InspectionTask::create($data);

        return response()->json($task->refresh(), 201);
    }

    public function start(InspectionTask $task): JsonResponse
    {
        $task->update([
            'status' => '进行中',
            'started_at' => now(),
        ]);

        return response()->json($task->fresh());
    }

    public function submit(InspectionTask $task): JsonResponse
    {
        $task->update([
            'status' => '已提交',
            'submitted_at' => now(),
        ]);

        return response()->json($task->fresh());
    }
}
