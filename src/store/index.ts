import { createStore } from "redux";
import { addFile, addSubTask, changeTask } from "../components/pages/Tasks";
import { deleteFile } from "../components/UI/FileUpload/FileUpload";




export interface projects {
    title:string;
    id:number;
    tasks: tasks[]
}
export interface tasks{
    title:string;
    id:number;
    description:string;
    status:string;
    files:{id:number;base64:string;name:string}[]|null;
    isCreated:string;
    importance:"high"|"average"|"low"
    isOver:string|null;
    comments:any;
    subTask:tasks[]
}
const prevState = localStorage.getItem("Projects")
// console.log(JSON.parse(JSON.parse(prevState)))
const initialState:projects[] =  prevState?JSON.parse(prevState):[]

const reducer = (state=initialState,action:any)=>{

    switch(action.type){
        case "ADDPROJECT":  {
            const newArr:projects[] = [...state]
            newArr.push({title:action.payload,id: state.length+1, tasks:[]})
            return newArr;
        }
        case "ADDTASK":{
            const newArr:projects[] = [...state]
            const neededProject = newArr.find(a=>a.id===action.payload.id)
            if(neededProject)neededProject.tasks.push({
                title:action.payload.title as string,
                description:action.payload.description as string,
                id:neededProject.tasks.length+1,
                status:action.payload.status as string,
                files:null,
                importance:action.payload.importance,
                isCreated:action.payload.isCreated as string,
                isOver:action.payload.status==="Done"?new Date().toISOString():null,
                comments:null,
                subTask:[]
            })
            return newArr
        }
        case "DROPTASK":{
            const newArr:projects[] = [...state]
            const neededProject1 = newArr.find(a=>a.id===action.payload.projectId)
            if(neededProject1){
                const neededTask = neededProject1.tasks.find(a=>a.id === action.payload.task.id)
                if(neededTask && neededTask.status!==action.payload.status){
                    if(neededTask.status==="Done" && action.payload.status!=="Done"){
                        neededTask.isOver = null
                    }
                    neededTask.status = action.payload.status
                    if(action.payload.status==="Done"){
                        neededTask.isOver = new Date().toISOString()
                    }
                }

            }
            return newArr
        }
        case "ADDSUBTASK":{
            const payload: addSubTask = action.payload
            const newArr:projects[] = [...state]
            const neededProject = newArr.find(a=>a.id===payload.projectId)
            if(neededProject){
                const neededTask = neededProject.tasks.find(a=>a.id === payload.taskId)
                if(neededTask){
                    neededTask.subTask.push({
                        title:payload.title as string,
                        description:payload.description as string,
                        id:neededTask.subTask.length+1,
                        status: payload.status as string,
                        files:null,
                        importance:payload.importance,
                        isCreated: payload.isCreated as string,
                        isOver: payload.status==="Done"?new Date().toISOString():null,
                        comments:null,
                        subTask:[]
                    })
                }
            }
            return newArr
        }
        case "CHANGETASK":{
            const payload:changeTask = action.payload;
            const newArr = [...state];
            const neededProject = newArr.find(a=>a.id === payload.projectId)
            if(neededProject){
                const neededTask = neededProject.tasks.find(a=>a.id ===payload.taskId)
                if(neededTask){
                    if(payload.subtaskId){
                        const neededSubtask = neededTask.subTask.find(a=>a.id===payload.subtaskId)
                        if(neededSubtask){
                            neededSubtask.description = payload.description;
                            neededSubtask.title = payload.title
                            neededSubtask.status = payload.status
                            neededSubtask.importance = payload.importance
                            if(payload.status==="Done"){
                                neededSubtask.isOver = new Date().toISOString()
                            }
                            if(neededSubtask.status==="Done" && action.payload.status!=="Done"){
                                neededSubtask.isOver = null
                            }
                        }
                    }else{
                        neededTask.description = payload.description;
                        neededTask.title = payload.title
                        neededTask.status = payload.status
                        neededTask.importance = payload.importance
                        if(payload.status==="Done"){
                            neededTask.isOver = new Date().toISOString()
                        }
                        if(neededTask.status==="Done" && action.payload.status!=="Done"){
                            neededTask.isOver = null
                        }
                    }
                }
            }
            return newArr
        }
        case "ADDFILE":{
            const newArr = [...state]
            const payload:addFile = action.payload
            const neededProject = newArr.find(a=>a.id===payload.projectId)
            if(neededProject){
                const neededTask = neededProject.tasks.find(a=>a.id===payload.taskId)
                if(neededTask){
                    if(neededTask.files){
                        neededTask.files.push(payload.File)
                    }else{
                        neededTask.files = [payload.File]
                    }
                    
                }
            }
            return newArr
        }
        case "DELETEFILE":{
            const newArr = [...state]
            const payload:deleteFile = action.payload
            const neededProject = newArr.find(a=>a.id===payload.projectId)
            if(neededProject){
                const neededTask = neededProject.tasks.find(a=>a.id===payload.taskId)
                if(neededTask){
                    if(neededTask.files) neededTask.files = neededTask.files.filter(a=>a.id !== payload.fileId)      
                }
            }
            return newArr
        }
        default: return state
    }
}
const store = createStore(reducer)

export default store