import React, { useEffect, useState } from 'react'
import { projects, tasks } from '../../store';
import {connect} from "react-redux"
import { useParams } from 'react-router-dom';
import { Button } from '../UI/Button/Button';
import { DndProvider } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { TaskContentItem } from '../TaskContentItem';
import { ModalAddTask } from '../ModalAddTask';
import { ModalChangeTask } from '../ModalChangeTask';
import { Search } from '../Search';
interface props{
    projects:projects[];
    addTask:(smth:{title:string;description:string,id:number,status:string,isCreated:string,importance:"high"|"average"|"low"})=>void;
    dropTask:(smth:{task:tasks;projectId:number;status:string})=> void;
    addSubTask: (smth:addSubTask)=>void;
    changeTask: (smth: changeTask)=>void;

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
const Tasks = ({projects,addTask,dropTask,addSubTask,changeTask}:props) => {
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
  return (
    <>
    {project && noFilteredProject &&
            <div className='Tasks'>
                <Search project={noFilteredProject} setProject={setProject}/>
                <h2>{project?.title}</h2>
                <DndProvider options={HTML5toTouch}>
                    <div className='TasksContent'>
                        <TaskContentItem type='Queue' tasks={project.tasks} id={project.id} dropTask={dropTask} setSubTask={setSubTask} setChange={setChange}/>
                        <TaskContentItem type='Development' tasks={project.tasks} id={project.id} dropTask={dropTask} setSubTask={setSubTask} setChange={setChange}/>
                        <TaskContentItem type='Done' tasks={project.tasks} id={project.id} dropTask={dropTask} setSubTask={setSubTask} setChange={setChange}/>
                    </div>            
                </DndProvider>
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
        dropTask:({task,projectId,status}:{task:tasks;projectId:number;status:string})=>{
            dispatch({type:"DROPTASK",payload:{task,projectId,status}})
        },
        addSubTask: (smth:addSubTask)=>{
            dispatch({type:"ADDSUBTASK", payload:smth})
        },
        changeTask: (smth: changeTask)=>{
            dispatch({type:"CHANGETASK", payload:smth})
        }
    }
}

export default connect(mapStateTopProps,mapDispatchToProps)(Tasks)