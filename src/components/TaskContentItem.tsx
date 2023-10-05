import React, { useState } from 'react'
import { tasks } from '../store';
import { TaskItem } from './UI/TaskItem/TaskItem';
import { useDrop } from 'react-dnd/dist/hooks/useDrop';
import {Droppable, Draggable} from "react-beautiful-dnd"
import { addFile, deleteTask, isChange } from './pages/Tasks';
interface props{
    type:string;
    tasks:tasks[];
    id:number;
    setSubTask:(smth:boolean|number)=>void;
    setChange: (smth:isChange)=>void;
    deleteTask:(smth:deleteTask)=> void;
}


export const TaskContentItem = ({type,tasks,id,setSubTask,setChange, deleteTask}:props) => {


  return (
    <div>
        <h3>{type}</h3>
        <Droppable droppableId={`${id}_${type}`}>
            {(provided:any,snapshot:any)=>{
                return (
                    <div {...provided.droppableProps}
                        ref={provided.innerRef}>
                        {tasks.filter(a=>{
                            if(a?.status) return a.status === type
                            return false
                        }).map((a,i)=>{
                            return <TaskItem task={a} key={a.id} setSubTask={setSubTask} setChange={setChange} projectId={id} index={i} deleteTask={deleteTask}/>
                        })}
                    {provided.placeholder}
                    </div>                      
                )
            }}
          
        </Droppable>

    </div>
  )
}
