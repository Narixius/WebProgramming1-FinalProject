import create from "zustand";
import {$fetch} from "../services/fetch";
import {useCallback, useEffect, useState} from "react";
import {LOGIN_API} from "../constants/api";

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
