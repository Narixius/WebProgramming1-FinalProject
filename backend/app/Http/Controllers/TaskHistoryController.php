<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TaskHistory;
use App\Models\Task;
use OpenApi\Annotations as OA;

class TaskHistoryController extends Controller
{
    /**
     * @OA\Get(
     *     path="/task/{id}/history",
     *     tags={"task"},
     *     operationId="getTaskHistory",
     *     @OA\Response(
     *         response=405,
     *         description="Invalid input"
     *     ),
     *     @OA\Parameter(
     *         description="Task id",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(type="string"),
     *         @OA\Examples(example="int", value="1", summary="An int value.")
     *     )
     * )
     */
    public function getTaskHistory($taskId, Request $request) {
        /** @var Task $task */
        $task = Task::find($taskId);
        if(!$task)
            return response()->json([
                'message' => 'Task not found.'
            ], 404);
        return response()->json($task->histories()->with("user")->orderBy('created_at', 'desc')->get());
    }
}
