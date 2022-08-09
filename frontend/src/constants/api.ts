export const LOGIN_API = "/login"
export const TASKS_API = "/task"
export const TASK_API = (taskId:string) => `/task/${taskId}`
export const TASK_HISTORY_API = (taskId:string) => `/task/${taskId}/history`
export const USERS_API = '/user'
export const USER_API = (userId: string) => `/user/${userId}`
