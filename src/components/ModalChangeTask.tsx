import React, { useEffect, useState } from 'react'
import { changeTask, isChange } from './pages/Tasks';
import { Modal } from './UI/Modal/Modal';
import { Input } from './UI/Input/Input';
import { Textarea } from './UI/Textarea/Textarea';
import { Button } from './UI/Button/Button';
import { tasks } from '../store';
interface props{
    isVisibleAdd:boolean;
    setVisibleAdd:(smth:boolean)=>void;
    projectId:number;
    isChange: isChange|null;
    changeTask: (smth: changeTask)=>void;
    setChange: (smth:isChange|null)=>void;

}


export const ModalChangeTask = ({isVisibleAdd,setVisibleAdd, projectId, isChange,changeTask,setChange}:props) => {
    const [isTaskTitle,setTaskTitle] = useState(isChange?isChange.task.title:"")
    const [isDescription,setDescription] = useState(isChange?isChange.task.description:"")
    const [isStatusTask,setStatusTask] = useState(isChange?isChange.task.status:"")
    const [isImportance, setImportance] = useState<"average"|"high"|"low">(isChange?isChange.task.importance:"average")
    useEffect(()=>{
        if(isChange){
            setTaskTitle(isChange.task.title)
            setDescription(isChange.task.description)
            setStatusTask(isChange.task.status)
            setImportance(isChange.task.importance)
        }
    },[isChange])
  return (
    <Modal visible={isVisibleAdd} setVisible={setVisibleAdd}>
        <div className='ChangeTaskModal'>
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
                if(isChange)changeTask({projectId,taskId:isChange.taskId,subtaskId:isChange.subtaskId,status:isStatusTask,title:isTaskTitle,description:isDescription, importance:isImportance})
                setChange(null)
                setVisibleAdd(false)
            }}>Change</Button>            
        </div>

    </Modal>
  )
}
