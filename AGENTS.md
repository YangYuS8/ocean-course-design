# Ocean Course Design — Agent Brief

## Goal

Build a simplified course-design/defense version of the original `/home/yangyus8/Code/ocean` project.

The original project must remain untouched. This repository is a new, student-friendly version.

## Mandatory Constraints

- Backend must use PHP. Use Laravel because the original project already uses Laravel and the user says the PHP framework can continue.
- Keep frontend/backend separated.
- Keep the project understandable for undergraduate course defense.
- Do not copy enterprise complexity from the original project.
- Default local database should be SQLite for easy demo.
- Documentation should help the user and teammates understand and answer defense questions.

## Simplified Business Chain

```text
Inspection tasks -> Samples -> Sample results -> Exceptions -> Analysis suggestion -> Dashboard
```

Chinese explanation:

```text
巡检任务 -> 样本登记 -> 检测结果录入 -> 异常上报处理 -> 简单分析建议 -> 首页统计
```

Samples should retain lightweight field-work realism from the original design: record weather and coordinate, expose a sample detail view, and show generated analysis report summaries. Do not add heavy media upload, object storage, Python workers, or real AI recognition for this course version.

## Keep

- Laravel routes/controllers/models/migrations/seeders.
- React + TypeScript + Vite frontend.
- Simple dashboard/admin layout.
- SQLite seed data.
- Clear Markdown docs.

## Remove / Do Not Add

- Redis queue.
- Python worker.
- Full RBAC permission system.
- Audit log system.
- Image upload / image recognition.
- Docusaurus docs site.
- Docker-first production deployment.
- Over-abstracted service layer.
- Complex i18n.

## Recommended Pages

Frontend pages:

1. Dashboard
2. Inspection Tasks
3. Samples
4. Results
5. Exceptions & Analysis
6. About / System Guide

Samples page should include a detail panel showing the selected sample, results, exceptions, and analysis report summaries. Dashboard should show recent analysis suggestions, not only counters.

## Recommended Backend Tables

- users
- inspection_tasks
- samples
- sample_results
- exceptions
- analysis_jobs

## Recommended API

- `GET /api/dashboard`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `POST /api/tasks/{id}/start`
- `POST /api/tasks/{id}/submit`
- `DELETE /api/tasks/{id}`
- `GET /api/samples`
- `POST /api/samples`
- `PUT /api/samples/{id}`
- `DELETE /api/samples/{id}`
- `GET /api/samples/{id}`
- `POST /api/samples/{id}/results`
- `GET /api/results`
- `PUT /api/results/{id}`
- `DELETE /api/results/{id}`
- `GET /api/exceptions`
- `POST /api/exceptions`
- `POST /api/exceptions/{id}/resolve`
- `POST /api/samples/{id}/analyze`

## Internal Demonstration Flow

Keep defense/course wording in Markdown documentation only. Do not expose words like
"course design", "defense", "demo", or "presentation" in the frontend UI; the
frontend should look like a real ocean inspection management product.

1. Open dashboard and explain the business chain.
2. Start an inspection task.
3. Register a sample.
4. Add a test result.
5. Trigger/submit an exception.
6. Resolve the exception.
7. Run simplified analysis for a sample.
8. Return to dashboard and show updated statistics.

## Style

- Professional but simple.
- Ocean/teal color palette.
- Sidebar + top header + content cards/tables.
- Use Chinese UI labels by default.
- Avoid flashy effects.

## Delivery

The final repository should support:

```bash
cd backend
php artisan migrate --seed
php artisan serve

cd frontend
pnpm install
pnpm run dev
```

And include clear `README.md` and `docs/` for course defense.
