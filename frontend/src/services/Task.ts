import {$fetch} from "./fetch";
import {useStore} from "../store";
import {TASK_API, TASK_HISTORY_API, TASKS_API} from "../constants/api";
import {User} from "./User";

export type StatusType = "ToDo" | "Blocked" | "InProgress" | "InQA" | "Done" | "Deployed";

export type TaskHistory = {
    type: 'update'| 'delete'|'create';
    taskId: number;
    lastValue: {
        title?: string;
        description?: string;
        status?: StatusType;
    } | null;
    newValue: {
        title?: string;
        description?: string;
        status?: StatusType;
    } | null;
    user: User,
    [key: string]: any
}
export class Task {
    public title = "";
    public description = "";
    public status: StatusType = "ToDo";
    public id: number;
    public cb;

    constructor(id: number, title:string, description:string, status: StatusType, cb?: any) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.cb = cb;
    }

    public static createTask = async (body: {title: string, description: string}) => {
        return await $fetch({
            'Authorization' : `Bearer ${useStore.getState().token}`
        })<Task>(TASKS_API, {
            method: "POST",
            body
        })
        .then((task)=>{
            return new Task(task.id, task.title, task.description, task.status)
        })
    }

    public static getTask = async (taskId:string | number, cb:any) => {
        return await $fetch({
            'Authorization' : `Bearer ${useStore.getState().token}`
        })<Task>(TASK_API(String(taskId)))
            .then((task)=>{
            return new Task(task.id, task.title, task.description, task.status, cb)
        })
    }
    public static getAllTasks = async (cb:any) => {
        return await $fetch({
            'Authorization' : `Bearer ${useStore.getState().token}`
        })<Task[]>(TASKS_API)
            .then((tasks)=>{
                return tasks.map((task) => new Task(task.id, task.title, task.description, task.status, cb))
            })
    }

    public update = async (body: {title?: string, description?: string, status?: StatusType}) => {
        return await $fetch({
            'Authorization' : `Bearer ${useStore.getState().token}`
        })<Task>(TASK_API(String(this.id)), {
            body,
            method: "PATCH"
        })
        .then((task)=>{
            if(this.cb)
                this.cb();
            return new Task(task.id, task.title, task.description, task.status)
        })
    }

    public static getTaskHistory = async (taskId:string | number) => {
        return await $fetch({
            'Authorization' : `Bearer ${useStore.getState().token}`
        })<TaskHistory[]>(TASK_HISTORY_API(String(taskId)))
            .then((histories)=>{
                return histories.map(history => ({
                    type: history.type,
                    taskId: history['task_id'],
                    lastValue: history['last_value'],
                    newValue: history['new_value'],
                    user: history.user,
										createdAt: history.created_at
                }))
            })
    }

    public delete = async () => {
        return await $fetch({
            'Authorization' : `Bearer ${useStore.getState().token}`
        })<{ message: string }>(TASK_API(String(this.id)), {
            method: "Delete"
        }).then(()=>{
            if(this.cb)
                this.cb()
        })
    }
}
