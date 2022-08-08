import {FC} from "react";
import {useAuth, useStore} from "../../store";
import {Link as RouterLink, Navigate, Route, Routes} from "react-router-dom";
import {Flex} from "../../../components/Flex";
import {styled} from "../../../stitches.config";
import {Users} from './users'
import {Tasks} from './tasks'
import {TaskEdit} from "./tasks/Edit";
import {UserEdit} from "./users/Edit";
import {Box} from "../../../components/Box";

const Link = styled(RouterLink, {
    margin: '10px 20px'
})

export const Manage:FC = () => {
    const {user, loading} = useAuth();

    console.log(user, loading)
    const {logout} = useStore();
    const handleLogout = (e:any)=>{
        e.preventDefault();
        logout();
    }
    if(loading)
        return <div>loading...</div>;
    if(!user && loading === false)
        return <Navigate to="/auth" replace={true} />

    const isAdmin = user && user.role.includes("ROLE_ADMIN");
    return <div>
        <Flex css={{
            justifyContent: 'space-between'
        }}>
            <Box>
                {isAdmin && <Link to={'/user'}>Users</Link>}
                <Link to={'/task'}>Tasks</Link>
            </Box>
            <a href="#" onClick={handleLogout}>
                Logout
            </a>
        </Flex>

        <Routes>
            {isAdmin && <Route path="/user" element={<Users/>}/>}
            {isAdmin && <Route path="/user/:id" element={<UserEdit/>}/>}
            <Route path="/task/:id" element={<TaskEdit/>}/>
            <Route path="/task" element={<Tasks/>}/>
            <Route path="*" element={<Navigate to={"/task"}/>}/>
        </Routes>
    </div>;
}

export default Manage;