import { useCallback, useEffect, useState } from "react";
import { Task } from "../services/Task";
import { User } from "../services/User";

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
