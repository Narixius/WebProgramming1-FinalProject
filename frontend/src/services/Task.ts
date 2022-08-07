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
    public title: string = "";
    public description: string = "";
    public status: StatusType = "ToDo";
    public id: number;
    constructor(id: number, title:string, description:string, status: StatusType) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
    }

    public static createTask = async (body: {title: string, description: string, status: StatusType}) => {
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

    public static getTask = async (taskId:string | number) => {
        return await $fetch({
            'Authorization' : `Bearer ${useStore.getState().token}`
        })<Task>(TASK_API(String(taskId)))
            .then((task)=>{
            return new Task(task.id, task.title, task.description, task.status)
        })
    }
    public static getAllTasks = async () => {
        return await $fetch({
            'Authorization' : `Bearer ${useStore.getState().token}`
        })<Task[]>(TASKS_API)
            .then((tasks)=>{
                return tasks.map((task) => new Task(task.id, task.title, task.description, task.status))
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
                    user: history.user
                }))
            })
    }

    public delete = async () => {
        return await $fetch({
            'Authorization' : `Bearer ${useStore.getState().token}`
        })<{ message: string }>(TASK_API(String(this.id)), {
            method: "Delete"
        })
    }
}