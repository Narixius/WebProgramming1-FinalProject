import {$fetch} from "./fetch";
import {useStore} from "../store";
import {TASK_API, USER_API, USERS_API} from "../constants/api";


export class User {
    name: string = "";
    role: string[] = [];
    email: string = "";
    id: number = 0;
    cb;

    constructor(name: string, role: string[], email: string, id: number, cb?: any) {
        this.name = name;
        this.role = role;
        this.email = email;
        this.id = id;
        this.cb = cb;
    }

    static addUser = async (body: {name: string, password: string, email: string}) => {
        return await $fetch({
            'Authorization' : `Bearer ${useStore.getState().token}`
        })<User>(USERS_API, {
            method: 'POST',
            body
        })
        .then((user)=>{
            return new User(user.name, user.role, user.email, user.id, null)
        })
    }

    static getAllUsers = async (cb:any) => {
        return await $fetch({
            'Authorization' : `Bearer ${useStore.getState().token}`
        })<User[]>(USERS_API)
        .then((users)=>{
            return users.map(user=>new User(user.name, user.role, user.email, user.id, cb))
        })
    }

    static getUser = async (userId: string, cb:any) => {
        return await $fetch({
            'Authorization' : `Bearer ${useStore.getState().token}`
        })<User>(USER_API(String(userId)))
        .then((user)=>{
            return new User(user.name, user.role, user.email, user.id, cb)
        })
    }

    update = async (body: {name: string, password: string}) => {
        return await $fetch({
            'Authorization' : `Bearer ${useStore.getState().token}`
        })<User>(USER_API(String(this.id)), {
            method: 'PATCH',
            body
        })
        .then((user)=>{
            if(this.cb)
                this.cb();
            return new User(user.name, user.role, user.email, user.id)
        })
    }

    delete = async () => {
        return await $fetch({
            'Authorization' : `Bearer ${useStore.getState().token}`
        })<{ message: string }>(USER_API(String(this.id)), {
            method: 'DELETE'
        }).then(()=>{
            if(this.cb)
                this.cb();
        })
    }
}