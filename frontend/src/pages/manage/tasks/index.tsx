import {useTasks} from "../../../store";

export const Tasks = () => {
    const {tasks} = useTasks();

    console.log(tasks)
    return <span>tasks</span>
}