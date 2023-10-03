import React, { useEffect, useState } from 'react'
import { Modal } from './UI/Modal/Modal';
import { Input } from './UI/Input/Input';
import { Textarea } from './UI/Textarea/Textarea';
import { Button } from './UI/Button/Button';
import { addSubTask } from './pages/Tasks';

interface props{
    isVisibleAdd:boolean;
    setVisibleAdd:(smth:boolean)=>void;
    addTask:(smth:{title:string;description:string,id:number,status:string,isCreated:string, importance:"high"|"average"|"low"})=>void;
    id:number;
    taskId:boolean|number;
    addSubTask: (smth:addSubTask)=>void;
    setSubTask:(smth:boolean|number)=>void
}

export const ModalAddTask = ({isVisibleAdd,setVisibleAdd, addTask,id, taskId=0, addSubTask,setSubTask}:props) => {
    const [isTaskTitle,setTaskTitle] = useState("")
    const [isDescription,setDescription] = useState("")
    const [isStatusTask,setStatusTask] = useState("Queue")
    const [isImportance, setImportance] = useState<"average"|"high"|"low">("average")
    useEffect(()=>{
        if(!isVisibleAdd){
            setTaskTitle("")
            setDescription("")
            setSubTask(false)
        }
    },[isVisibleAdd])
  return (
    <Modal visible={isVisibleAdd} setVisible={setVisibleAdd}>
        <div className='AddTaskModal'>
            <Input name='Title' value={isTaskTitle} setValue={setTaskTitle} placeholder='Title'/>
            <label>Description</label>
            <Textarea value={isDescription} setValue={setDescription} placeholder='description'></Textarea>
            <div className='ChooseStatusForTask'>
                <div>
                    <Button onClick={()=>setStatusTask("Queue")}>Queue</Button>
                    <div style={isStatusTask==="Queue"?{width:"100%",background:"white"}:{width:"0%"}}></div>
                </div>
                <div>
                    <Button onClick={()=>setStatusTask("Development")} >Development</Button>
                    <div style={isStatusTask==="Development"?{width:"100%",background:"white"}:{width:"0%"}}></div>
                </div>
                <div>
                    <Button onClick={()=>setStatusTask("Done")} >Done</Button>
                    <div style={isStatusTask==="Done"?{width:"100%",background:"white"}:{width:"0%"}}></div>
                </div>
                <div>
                    <Button onClick={()=>setImportance("high")}>High</Button>
                    <div style={isImportance==="high"?{width:"100%",background:"white"}:{width:"0%"}}></div>
                </div>
                <div>
                    <Button onClick={()=>setImportance("average")} >Average</Button>
                    <div style={isImportance==="average"?{width:"100%",background:"white"}:{width:"0%"}}></div>
                </div>
                <div>
                    <Button onClick={()=>setImportance("low")} >Low</Button>
                    <div style={isImportance==="low"?{width:"100%",background:"white"}:{width:"0%"}}></div>
                </div>
            </div>
            <Button onClick={()=>{
                if(!taskId)
                    addTask({title:isTaskTitle,description:isDescription,id,status:isStatusTask,isCreated:new Date().toISOString(),importance:isImportance});
                if(taskId && typeof taskId==="number")
                    addSubTask({title:isTaskTitle,description:isDescription,projectId:id,status:isStatusTask,isCreated:new Date().toISOString(), taskId, importance:isImportance})
                    setVisibleAdd(false)}}>Create</Button>        
        
        </div>

    </Modal>
  )
}
