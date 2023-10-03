import React, { useState } from 'react'
import { tasks } from '../store';
import { TaskItem } from './UI/TaskItem/TaskItem';
import { useDrop } from 'react-dnd/dist/hooks/useDrop';
import { addFile, isChange } from './pages/Tasks';
interface props{
    type:string;
    tasks:tasks[];
    id:number;
    dropTask:(smth:{task:tasks;projectId:number;status:string})=> void;
    setSubTask:(smth:boolean|number)=>void;
    setChange: (smth:isChange)=>void;
}


export const TaskContentItem = ({type,tasks,id,dropTask,setSubTask,setChange}:props) => {
    const [,drop] = useDrop(()=>({
        accept:"task",
        drop: (item:tasks)=> addTask(item)
    }))
    const addTask = (task:tasks)=>{
        dropTask({task,projectId:id, status:type})
    }


  return (
    <div>
        <h3>{type}</h3>
        <div ref={drop}>
            {tasks.filter(a=>a.status===type).sort((a,b)=>{
                const an = a.importance ==="high"?1:a.importance ==="average"?2:3;
                const bn = b.importance ==="high"?1:b.importance ==="average"?2:3
                return an-bn
            }).map(a=>{
                return <TaskItem task={a} delete={()=>{}} key={a.id} setSubTask={setSubTask} setChange={setChange} projectId={id}/>
            })}
        </div>
    </div>
  )
}
