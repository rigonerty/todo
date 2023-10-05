import React, { useEffect, useState } from 'react'
import { projects, tasks } from '../../store';
import {connect} from "react-redux"
import { useParams } from 'react-router-dom';
import { Button } from '../UI/Button/Button';
import { DndProvider } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd"
import { TaskContentItem } from '../TaskContentItem';
import { ModalAddTask } from '../ModalAddTask';
import { ModalChangeTask } from '../ModalChangeTask';
import { Search } from '../Search';
interface props{
    projects:projects[];
    addTask:(smth:{title:string;description:string,id:number,status:string,isCreated:string,importance:"high"|"average"|"low"})=>void;
    dropTask:(smth:{taskId:number;projectId:number;status:string})=> void;
    addSubTask: (smth:addSubTask)=> void;
    changeTask: (smth: changeTask)=> void;
    deleteTask:(smth:deleteTask)=> void;
}
export interface addSubTask{
    title:string;
    description:string;
    projectId:number;
    status:string;
    isCreated:string;
    taskId:number;
    importance:"high"|"average"|"low";
}

export interface changeTask{
    title:string;
    description:string;
    projectId:number;
    status:string;
    taskId:number;
    subtaskId:number;
    importance:"high"|"average"|"low"
}
export interface addFile {
    projectId:number;
    taskId:number;
    File: {id:number; name:string; base64:string}
} 
export interface isChange{
    type:"task"|"subtask";
    taskId:number;
    subtaskId:number;
    task:tasks
} 
export interface deleteTask{
    projectId:number;
    taskId:number;
    subtaskId:number;
}



const Tasks = ({projects,addTask,dropTask,addSubTask,changeTask,deleteTask}:props) => {
    const {id} = useParams()
    const noFilteredProject = projects.find(a=>a.id+""===id)
    const [project, setProject] = useState(projects.find(a=>a.id+""===id))
    const [isVisibleAdd,setVisibleAdd] = useState(false)
    const [isSubTask,setSubTask] = useState<number|boolean>(false)
    const [isVisibleChange,setVisibleChange] = useState(false)
    const [isChange,setChange] = useState<isChange|null>(null)
    useEffect(()=>{
        if(isSubTask) setVisibleAdd(true)
    },[isSubTask])
    useEffect(()=>{
        if(isChange) setVisibleChange(true)
    },[isChange])
    const onDragEnd = (result:any)=>{
        if(!result.destination) return
        const {source,destination, draggableId} = result
        if(source.droppableId !==destination.droppableId){
            dropTask({
                projectId:+destination.droppableId.split("_")[0] as number, 
                status: destination.droppableId.split("_")[1] as string,
                taskId:+draggableId})
        }else if(project){
            const status = source.droppableId.split("_")[1]
            const copyedColumn = project.tasks.filter(a=>a.status===status)
            const neededColumn1 = status === "Done"?"Queue":status==="Queue"?"Development":"Done"
            const neededColumn2 = status === "Done"?"Development":status==="Queue"?"Done":"Queue"
            const copyedColumn2 = project.tasks.filter(a=>a.status===neededColumn1)
            const copyedColumn3 = project.tasks.filter(a=>a.status===neededColumn2)
            const [removed] = copyedColumn.splice(source.index,1)
            copyedColumn.splice(destination.index,0,removed)
            setProject({...project, tasks:[...copyedColumn, ...copyedColumn2,...copyedColumn3]})
        }
        
    }
  return (
    <>
    {project && noFilteredProject &&
            <div className='Tasks'>
                <Search project={noFilteredProject} setProject={setProject}/>
                <h2>{project?.title}</h2>
                <DragDropContext onDragEnd={(result:any)=>{onDragEnd(result)}}>
                    <div className='TasksContent'>
                        <TaskContentItem type='Queue' tasks={project.tasks} id={project.id} setSubTask={setSubTask} setChange={setChange} deleteTask={deleteTask}/>
                        <TaskContentItem type='Development' tasks={project.tasks} id={project.id}setSubTask={setSubTask} setChange={setChange} deleteTask={deleteTask}/>
                        <TaskContentItem type='Done' tasks={project.tasks} id={project.id} setSubTask={setSubTask} setChange={setChange} deleteTask={deleteTask}/>
                    </div>                     
                </DragDropContext>
                <Button onClick={()=>setVisibleAdd(true)}>Add +</Button>
                <ModalAddTask
                    isVisibleAdd={isVisibleAdd} setVisibleAdd={setVisibleAdd}
                    id={project.id} addTask={addTask} taskId={isSubTask} addSubTask={addSubTask} setSubTask={setSubTask}/>
                <ModalChangeTask
                    isVisibleAdd={isVisibleChange} setVisibleAdd={setVisibleChange}
                    projectId={project.id} changeTask={changeTask} isChange={isChange} setChange={setChange}/>

            </div>
        }    
    </>
    
    
  )
}
function mapStateTopProps(state:projects[]){
    localStorage.setItem("Projects",JSON.stringify(state))
    return {projects: state}
}
function mapDispatchToProps(dispatch:any){
    return {
        addTask:({title,description,id,status,isCreated,importance}:{title:string,description:string,id:number,status:string,isCreated:string,importance:"high"|"average"|"low"})=>{
            dispatch({type:"ADDTASK", payload:{title,description,id,status,isCreated,importance}})
        },
        dropTask:({taskId,projectId,status}:{taskId:number;projectId:number;status:string})=>{
            dispatch({type:"DROPTASK",payload:{taskId,projectId,status}})
        },
        addSubTask: (smth:addSubTask)=>{
            dispatch({type:"ADDSUBTASK", payload:smth})
        },
        changeTask: (smth: changeTask)=>{
            dispatch({type:"CHANGETASK", payload:smth})
        },
        deleteTask:(smth:deleteTask)=>{
            dispatch({type:"DELETETASK",payload:smth})
        }
    }
}

export default connect(mapStateTopProps,mapDispatchToProps)(Tasks)