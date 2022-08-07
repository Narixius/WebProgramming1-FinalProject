import {FC, useState} from "react";
import {Input} from "../../components/Input";
import {Flex} from "../../components/Flex";
import {Box} from "../../components/Box";
import {Label} from "../../components/Label";
import {Button} from "../../components/Button";
import {useAuth, useStore} from "../store";
import {Navigate} from "react-router-dom";

export const Login:FC = () => {
    const {login} = useStore();
    const {user, loading} = useAuth()
    const [error, setError] = useState(undefined)
    const handleLogin = (e: any) => {
        e.preventDefault();
        setError(undefined)
        login({
            email: e.target.elements.email.value,
            password: e.target.elements.password.value
        }).catch((d)=>{
            setError(d.response._data.message)
        })
    }
    if(user && !loading)
        return <Navigate to={'/manage'} />

    if(loading)
        return <span>...</span>
    return <Box css={{
        maxWidth: '300px',
        width: '100%',
        margin: '0 auto'
    }}>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
            <Flex css={{
                flexDirection: 'column'
            }}>
                <Label css={{margin: '8px 0'}}>Email</Label>
                <Input name="email" />
                <Label css={{margin: '8px 0'}}>Password</Label>
                <Input name="password" />
                {
                    error ? <Box css={{backgroundColor: "rgba(255,0,0,0.2)", padding: '10px 15px', borderRadius: '5px', marginTop: '10px'}}>{error}</Box> : null
                }
                <Button css={{marginTop: '14px'}}>Login</Button>
            </Flex>
        </form>
    </Box>
}

export default Login;