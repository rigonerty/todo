import React, { useState } from 'react'
import ReactFileReader from 'react-file-reader'
import { Modal } from '../Modal/Modal'
import { projects, tasks } from '../../../store'
import { addFile } from '../../pages/Tasks'
import {connect} from "react-redux"

export interface deleteFile{
    projectId:number;
    taskId:number;
    fileId:number;
}


interface props{
    task: tasks;
    projects:projects[]
    addFile:(smth:addFile)=>void;
    deleteFile: (cmth:deleteFile)=>void;
    projectId:number;
}
const FileUpload = ({task,addFile,projectId,projects,deleteFile}:props) => {
    const [isVisible,setVisible] = useState(false)
    const handleFiles = (files:any) => {
        const id = Math.round(Math.random()*10000000000)
        addFile({projectId,taskId:task.id,File:{id,base64:files.base64, name:files.fileList[0].name}})
        }
  return (
    <>
        <button onClick={()=> setVisible(true)}>files</button>

        <Modal visible={isVisible} setVisible={setVisible}>
            <ReactFileReader handleFiles={handleFiles} fileTypes={[".jpg",".png"]} base64={true} multipleFiles={false}>
                <button className='UploadButton'>Upload</button>
            </ReactFileReader>
            <hr/>
            <div className='UploadedFiles'>
                {task.files?.map(a=>{
                    return <div key={a.id}><p>{a.name} </p> <button onClick={()=>deleteFile({projectId,taskId:task.id, fileId:a.id})}>🗑</button></div>
                })}
            </div>
        </Modal>
    
    </>

  )
}
function mapStateTopProps(state:projects[]){
    localStorage.setItem("Projects",JSON.stringify(state))
    return {projects: state}
}
function mapDispatchToProps(dispatch:any){
    return {
        addFile:(smth:addFile)=>{
            dispatch({type:"ADDFILE", payload:smth})
        },
        deleteFile:(smth: deleteFile)=>{
            dispatch({type:"DELETEFILE", payload:smth})
        }
    }
}

export default connect(mapStateTopProps,mapDispatchToProps)(FileUpload)