<?php

namespace App\Http\Controllers;

use App\Events\TaskChangeEvent;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;
use App\Models\Task;
use OpenApi\Annotations as OA;

enum TaskStatus: string
{
    case ToDo = "ToDo";
    case Blocked = "Blocked";
    case InProgress = "InProgress";
    case InQA = "InQA";
    case Done = "Done";
    case Deployed = "Deployed";
}

class TaskController extends Controller
{

    /**
     * Get all Tasks.tsx list
     *
     * @OA\Get(
     *     path="/api/task",
     *     tags={"task"},
     *     operationId="getAllTasks",
     *     @OA\Response(
     *         response=405,
     *         description="Invalid input"
     *     )
     * )
     */
    function getAll() {
        return response()->json(Task::orderBy("created_at", 'desc')->get());
    }

    /**
     * create a new task
     *
     * @OA\Post(
     *     path="/api/task",
     *     tags={"task"},
     *     operationId="createTask",
     *     @OA\Response(
     *         response=405,
     *         description="Invalid input"
     *     )
     * )
     */
    public function create(Request $request) {
        $post_data = $request->validate([
                'title'=>'required|string',
                'description'=>'required|string',
        ]);
        $task = Task::create([
            ...$post_data,
            'status' => TaskStatus::ToDo
        ]);
        TaskChangeEvent::dispatch("create",$task->id, null, $post_data);
        return response()->json($task);
    }
    /**
     * Delete a task
     *
     * @OA\Delete(
     *     path="/task/{id}",
     *     tags={"task"},
     *     operationId="deleteTask",
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
     *     ),
     * )
     */
    public function delete($taskId) {
        /** @var Task $task */
        $task = Task::find($taskId);
        if(!$task)
            return response()->json([
                "message" => "task not found!"
            ], 404);
        TaskChangeEvent::dispatch("delete",$taskId, null, null);
        $task->delete();
        return response()->json([
            "message" => "ok"
        ]);
    }
    /**
     * Update a task
     *
     * @OA\Patch(
     *     path="/task/{id}",
     *     tags={"task"},
     *     operationId="updateTask",
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
    public function update($taskId, Request $request) {
        /** @var Task $task */
        $task = Task::find($taskId);
        if(!$task)
            return response()->json([
                "message" => "task not found!"
            ], 404);
        $post_data = $request->validate([
            'title'=>'string',
            'description'=>'string',
            'status'=> "in:" . implode(',', $this->nextStatus($task->status))
        ]);
        TaskChangeEvent::dispatch("update", $taskId, $task, $post_data);
        $task->update($post_data);
        return response()->json($task);
    }

    private function nextStatus(String $currentStatus){
        switch ($currentStatus){
            case TaskStatus::ToDo->value:
                return [TaskStatus::InProgress->value, TaskStatus::ToDo->value];
            case TaskStatus::InProgress->value:
                return [TaskStatus::Blocked->value, TaskStatus::InQA->value, TaskStatus::InProgress->value];
            case TaskStatus::Blocked->value:
                return [TaskStatus::ToDo->value, TaskStatus::Blocked->value];
            case TaskStatus::InQA->value:
                return [TaskStatus::ToDo->value, TaskStatus::Done->value, TaskStatus::InQA->value];
            case TaskStatus::Done->value:
                return [TaskStatus::Deployed->value, TaskStatus::Done->value];
            default:
                return [TaskStatus::Deployed->value];
        }
    }

    /**
     * Get a task
     *
     * @OA\Get(
     *     path="/task/{id}",
     *     tags={"task"},
     *     operationId="getTask",
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
    public function getTask($taskId) {
        /** @var Task $task */
        $task = Task::find($taskId);
        if(!$task)
            return response()->json([
                "message" => "task not found!"
            ], 404);
        return response()->json($task);
    }
}
