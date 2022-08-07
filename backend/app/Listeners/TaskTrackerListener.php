<?php

namespace App\Listeners;

use App\Events\TaskChangeEvent;
use App\Models\TaskHistory;
use Illuminate\Support\Facades\Auth;
use stdClass;

class TaskTrackerListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function recursive_array_diff($a1, $a2) {
        $r = array();
        foreach ($a1 as $k => $v) {
            if (array_key_exists($k, $a2)) {
                if (is_array($v)) {
                    $rad = $this->recursive_array_diff($v, $a2[$k]);
                    if (count($rad)) { $r[$k] = $rad; }
                } else {
                    if ($v != $a2[$k]) {
                        $r[$k] = $v;
                    }
                }
            } else {
                $r[$k] = $v;
            }
        }
        return $r;
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\TaskChangeEvent  $event
     * @return void
     */
    public function handle(TaskChangeEvent $event)
    {
        $userId = Auth::user()->id;
        $last_value = [];
        if($event->type == "update") {
            $changes = $this->recursive_array_diff(
                [
                    "title" => $event->new_value['title'],
                    "description" => $event->new_value['description'],
                    "status" => $event->new_value['status']
                ], [
                    "title" => $event->last_value['title'],
                    "description" => $event->last_value['description'],
                    "status" => $event->last_value['status']
                ]
            );
            foreach ($changes as $key => $value) {
                $last_value[$key] = $event->last_value[$key];
            }
        } else {
            $changes = $event->new_value;
            $last_value = null;
        }
        if(($event->type === 'update' && sizeof($changes) > 0) || $event->type === 'delete' || $event->type === 'create') {
            TaskHistory::create([
                "user_id" => $userId,
                "type" => $event->type,
                "last_value" => $last_value ? json_encode((object) $last_value) : null,
                "new_value" => $changes ? json_encode($changes) : null,
                "task_id" => $event->task_id
            ]);
        }
    }
}
