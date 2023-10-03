import { Link } from "react-router-dom"
import { projects } from "../../../store"
import cl from "./ProjectsItem.module.css"
import React from 'react'

interface props{
    project: projects
}

export const ProjectsItem = ({project}:props) => {
  let isComplete = true
  project.tasks.map((a)=>{
    if(isComplete){
      if(a.status!=="Done"){
        isComplete = false
      }
    }
  })
  return (
    <Link to={project.id+""} className={cl.ProjectsItem}>
        <h2>{project.title}</h2>
        <i>{project.id}</i>
        <p>{isComplete?"Project was completed.":"Project in work."}</p>
    </Link>
  )
}
