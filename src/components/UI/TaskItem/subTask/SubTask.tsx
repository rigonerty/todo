import React, { useState } from 'react'
import { tasks } from '../../../../store'
import cl from "./SubTask.module.css"
import {parseISO, formatDistanceToNow, format} from "date-fns"
import { deleteTask, isChange } from '../../../pages/Tasks';
interface props{
    task:tasks;
    taskId:number;
    setChange:(smth:isChange)=>void;
    deleteTask:(smth:deleteTask)=> void;
    projectId:number
}
export const SubTask = ({task,taskId,setChange,deleteTask,projectId}:props) => {
    let time = ''
    let timeAgo=""
    let timeOver = ''
    if(task.isCreated){
        const date = parseISO(task.isCreated)
        if(task.isOver){
            const date = parseISO(task.isOver)
            timeOver = format(date,"yyyy/MM/dd")
        }
        const timeParsed = format(date,"yyyy/MM/dd")
        if(task.status!=="Done"){
            const timeParsedAgo = formatDistanceToNow(date)
            timeAgo = timeParsedAgo
        }
        time= timeParsed
    }
    const [isHeight,setHeight] = useState(false)
    const [isShow,setShow] = useState(task.description.length>71?true:false)
  return (
    <div className={cl.SubTaskItem}>
        <span>{task.status} / {task.importance}</span>
        <i>{taskId}.{task.id}</i>
        <h4>{task.title}</h4>
        <p style={isHeight?{height:"auto", position:"relative", overflow:"visible"}:{height:"5.15em", overflow:"hidden", position:"relative"}}>
            {task.description}
            {isShow&&<button onClick={()=>setHeight(!isHeight)} style={isHeight?{bottom:"-1.5em"}:{}}>{isHeight?"Show less":"Show more"}</button>}
        </p>
        <div>
            <div>
                {timeOver.length?<p>{timeOver} was over.</p>:<p>{time} was created.</p>}
                {timeAgo?<p>{timeAgo} in work.</p>:<p></p>}                
            </div>
            <button onClick={()=>{deleteTask({projectId,taskId,subtaskId:task.id})}}>🗑</button>
            <button onClick={()=>setChange({task,taskId,subtaskId:task.id,type:"subtask"})}>🖋</button>
        </div>
    </div>
  )
}
