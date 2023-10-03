import React, { MouseEvent, useEffect, useState } from 'react'
import { tasks } from '../../../store'
import cl from "./TaskItem.module.css"
import { useDrag } from 'react-dnd/dist/hooks'
import {parseISO, formatDistanceToNow, format} from "date-fns"
import { SubTask } from './subTask/SubTask'
import { addFile, isChange } from '../../pages/Tasks'
import FileUpload from '../FileUpload/FileUpload'
import { Dropdown } from '../DropDown/Dropdown'
interface props{
    task: tasks;
    projectId:number;
    delete: (smth:{projectId:number,id:number})=>void;
    setSubTask:(smth:boolean|number)=>void;
    setChange:(smth:isChange)=>void;
}

export const TaskItem = ({task,setSubTask,setChange,projectId}:props) => {
    const [{isDragging}, drag] = useDrag(()=>({
        type:"task",
        item:{...task},
        collect:(monitor)=> ({
            isDragging: !!monitor.isDragging(),
        }),
    }))
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
    const [isShow,setShow] = useState(task.description.length>=137?true:false)
    const stylesImportance = {
        background:task.importance==="high"?"#ac0505":task.importance==="average"?"#c2c508":"#1243ad",
        width:"max-content",
        padding:".2em",
        color:"black",
        borderRadius: ".2em",
        margin:"0"
    }
    const [isMoreVisible,setMoreVisible] = useState(false)
  return (
    <div style={{position:"relative"}}>
        <div className={cl.TaskItem} ref={drag} style={isDragging?{border:".1vw solid white"}:{}}>
            <i>{task.id}</i>
            <p style={stylesImportance}>{task.importance}</p>
            <h4>{task.title}</h4>
            <p style={isHeight?{height:"auto", position:"relative", overflow:"visible"}:{ overflow:"hidden", position:"relative"}} >
                {task.description}
                {isShow&&<button onClick={()=>setHeight(!isHeight)} style={isHeight?{bottom:"-1.5em"}:{}}>{isHeight?"Show less":"Show more"}</button>}
            </p>
            <div>
                <div>
                    {timeOver.length?<p>{timeOver} was over.</p>:<p>{time} was created.</p>}
                    {timeAgo?<p>{timeAgo} in work.</p>:<p></p>}                
                </div>

                <div>
                    <button onClick={()=> setMoreVisible(true)}>
                        ⁝
                    </button>              
                </div>

            </div>
            {task.subTask.length?
                <div className={cl.TaskItemSubTask}>
                    {task.subTask.sort((a,b)=>{
                        const an = a.importance ==="high"?1:a.importance ==="average"?2:3;
                        const bn = b.importance ==="high"?1:b.importance ==="average"?2:3
                        return an-bn
                    }).map(a=>{
                        return <SubTask task={a} taskId={task.id} setChange={setChange}/>
                    })}
                </div>
                :<></>    
            }
        </div>
        <Dropdown visible={isMoreVisible} setVisible={setMoreVisible} side={false}>
            <div className={cl.TaskDropDown}>
                <button>🗑 delete</button>
                <FileUpload task={task} projectId={projectId}/>
                <button onClick={()=>{setChange({task,taskId:task.id,subtaskId:0,type:"task"});setMoreVisible(false)}}>🖋 change</button>
                <button onClick={()=>{setSubTask(task.id);setMoreVisible(false)}}>+ add subtask</button>                        
            </div>
        </Dropdown>      
    </div>

  )
}
