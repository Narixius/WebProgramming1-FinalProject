import create from "zustand";
import {$fetch} from "../services/fetch";
import {useCallback, useEffect, useState} from "react";
import {LOGIN_API} from "../constants/api";
import {Task, TaskHistory} from "../services/Task";
import {User} from "../services/User";


export type StoreType = {
    user?: {
        name: string,
        role: string
    },
    token: string | null,
    login: (body: {email: string, password:string}) => Promise<any>,
    logout: () => void
}

const fetchUserRaw = (token:string) => $fetch({
    'Authorization' : `Bearer ${token}`
})("/me")

export const useAuth = () => {
    const { user, token } = useStore();
    const [loading, setLoading] = useState<boolean | undefined>(undefined)
    const fetchUser = useCallback(async () => {
        setLoading(true)
        await fetchUserRaw(String(token)).then(user => {
            useStore.setState({ user })
        }).finally(()=>{
            setLoading(false)
        })
    }, [])
    useEffect(()=>{
        if(!user && loading === undefined && token) {
            fetchUser()
        }else{
            setLoading(false)
        }
    }, [])
    if(user && typeof user.role === 'string')
        user.role = JSON.parse(user.role)
    return {user, loading: typeof loading === 'undefined' ? true : loading, fetchUser}
}
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

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const createUser = (...args: Parameters<typeof User.addUser>) => {
        return User.addUser(...args).then(fetchUsers)
    }
    const fetchUsers = useCallback(async () =>{
        setLoading(true);
        setUsers(await User.getAllUsers(fetchUsers).finally(setLoading.bind(null, false)));
    }, [])
    useEffect(()=>{
        fetchUsers();
    }, [])

    return {users, loading, createUser}
}

export const useUser = (userId: string) => {
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchTask = async () =>{
            setLoading(true);
            setUser(await User.getUser(userId, fetchTask).finally(setLoading.bind(null, false)));
        }
        fetchTask();
    }, [])

    return {user, loading}
}

export const useCreateTask = () => {
    return {createTask: Task.createTask}
}

export const useStore = create<StoreType>((set, get) => ({
    token: localStorage.getItem("AUTH_TOKEN"),
    logout: async ()=>{
        localStorage.removeItem("AUTH_TOKEN");
        set({
            user: undefined,
            token: undefined,
        })
    },
    login: async (body: {email: string, password: string}) => {
        return $fetch({})(LOGIN_API, {
            method: 'POST',
            body
        }).then(async (res) => {
            set({
                token: res.access_token
            })
            localStorage.setItem("AUTH_TOKEN", res.access_token);
            return await fetchUserRaw(res.access_token).then(user => {
                set({user});
                return user;
            });
        })
    }
}))
