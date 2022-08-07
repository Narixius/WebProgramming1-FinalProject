import {FC} from "react";
import {useAuth} from "../../store";
import {Link as RouterLink, Navigate, Route, Routes} from "react-router-dom";
import {Flex} from "../../../components/Flex";
import {styled} from "@stitches/react";
import {Users} from './users'
import {Tasks} from './tasks'

const Link = styled(RouterLink, {
    margin: '10px 20px'
})

export const Manage:FC = () => {
    const {user, loading} = useAuth();

    if(loading)
        return <div>loading...</div>;
    if(!user && loading === false)
        return <Navigate to="/auth" replace={true} />
    const isAdmin = user && user.role.includes("ROLE_ADMIN");
    return <div>
        <Flex>
            {isAdmin && <Link to={'/users'}>Users</Link>}
            <Link to={'/tasks'}>Tasks</Link>
        </Flex>

        <Routes>
            {isAdmin && <Route path="/users" element={<Users />} /> }
            <Route path="/tasks" element={<Tasks />} />
            <Route path="*" element={<Navigate to={"/tasks"} />} />
        </Routes>
    </div>;
}

export default Manage;