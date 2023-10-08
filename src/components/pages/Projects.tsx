import React, { useState } from 'react'
import {connect} from "react-redux"
import { projects } from '../../store'
import { Button } from '../UI/Button/Button';
import { Modal } from '../UI/Modal/Modal';
import { Input } from '../UI/Input/Input';
import { ProjectsItem } from '../UI/ProjectsItem/ProjectsItem';

interface props{
    projects:projects[];
    addProject:(smth:string)=>void;
}
const Projects = ({projects,addProject}:props) => {
    const [isVisibleAdd, setVisibleAdd] = useState(false)
    const [isTitle,setTitle] = useState("")
  return (
    <div className='Projects'>
        {projects.map(a=>{
            return <ProjectsItem project={a}/>
        })}

        <Modal visible={isVisibleAdd} setVisible={setVisibleAdd}>
            <Input value={isTitle} setValue={setTitle} placeholder='Title of project' name='Title'/> 
            <Button onClick={()=>{addProject(isTitle);setVisibleAdd(false);setTitle("")}}>Создать</Button>
        </Modal>
        <Button onClick={()=>setVisibleAdd(true)}>Add +</Button>
    </div>
  )
}
function mapStateTopProps(state:projects[]){
    localStorage.setItem("Projects",JSON.stringify(state))
    return {projects: state}
}
function mapDispatchToProps(dispatch:any){
    return {
        addProject:(title:string)=>{
            const action = {type:'ADDPROJECT',payload:title}
            dispatch(action)
        }
    }
}

export default connect(mapStateTopProps,mapDispatchToProps)(Projects)
