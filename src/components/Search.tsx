import React, { useState } from 'react'
import { Input } from './UI/Input/Input'
import { projects } from '../store'
interface props{
    project: projects;
    setProject:(smth:projects)=>void;
}
export const Search = ({project,setProject}:props) => {
    const [isValue, setValue] = useState("")
    const SearchTask = (e:string)=>{
        if(!e){
            setProject(project)
        }else{
            const proj:projects = {...project, tasks: project.tasks.filter(a=>{
                return a.title.toLocaleLowerCase().includes(e.toLocaleLowerCase()) || a.id == +e})}
                setProject(proj)            
        }


    }
  return (
    <div className='Search'>
        <Input name='' placeholder='Seacrh' value={isValue} setValue={setValue} onChange={SearchTask}/>
    </div>
  )
}
