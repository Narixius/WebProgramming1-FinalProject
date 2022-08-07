<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskChangeEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $last_value;
    public $new_value;
    public $type;
    public $task_id;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($type, $task_id, $last_value, $new_value)
    {
        $this->last_value = $last_value;
        $this->new_value = $new_value;
        $this->type = $type;
        $this->task_id = $task_id;
    }
}
