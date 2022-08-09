import {$fetch as $f} from "ohmyfetch";

export const $fetch = (headers: any) => $f.create({
        baseURL: 'http://localhost/api/',
        headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...headers
        }
})
