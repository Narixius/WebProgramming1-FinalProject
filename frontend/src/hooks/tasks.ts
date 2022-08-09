import { useCallback, useEffect, useState } from "react";
import { Task, TaskHistory } from "../services/Task";

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const createTask = (body: {title: string, description: string}) => {
        return Task.createTask(body).then(()=>{
            fetchTasks();
        })
    }
    const fetchTasks = useCallback(async () =>{
        setLoading(true);
        setTasks(await Task.getAllTasks(fetchTasks).finally(setLoading.bind(null, false)));
    }, [])
    useEffect(()=>{
        fetchTasks();
    }, [])

    return {tasks, loading, createTask}
}

export const useTask = (taskId: string) => {
    const [task, setTasks] = useState<Task>();
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchTask = async () =>{
            setLoading(true);
            setTasks(await Task.getTask(taskId, fetchTask).finally(setLoading.bind(null, false)));
        }
        fetchTask();
    }, [])

    return {task, loading}
}

export const useTaskHistory = (taskId: string) => {
    const [history, setHistory] = useState<TaskHistory[]>();
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchTask = async () =>{
            setLoading(true);
            setHistory(await Task.getTaskHistory(taskId).finally(setLoading.bind(null, false)));
        }
        fetchTask();
    }, [])

    return {history, loading}
}
