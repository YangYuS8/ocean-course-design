<?php

namespace App\Http\Controllers;

use App\Models\SampleException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExceptionController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            SampleException::with('sample:id,code,location')->latest()->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'sample_id' => ['required', 'exists:samples,id'],
            'title' => ['required', 'string', 'max:120'],
            'level' => ['nullable', 'string', 'max:20'],
            'description' => ['required', 'string'],
        ]);

        $exception = SampleException::create($data);
        $exception->sample()->update(['status' => '异常待处理']);

        return response()->json($exception->refresh(), 201);
    }

    public function resolve(Request $request, SampleException $exception): JsonResponse
    {
        $data = $request->validate([
            'resolution' => ['required', 'string'],
        ]);

        $exception->update([
            'status' => '已处理',
            'resolution' => $data['resolution'],
            'resolved_at' => now(),
        ]);
        $exception->sample()->update(['status' => '异常已处理']);

        return response()->json($exception->fresh());
    }
}
