import React, { useState } from "react";
import { AiTwotoneDelete, AiOutlineExclamationCircle } from "react-icons/ai";
import api from "../../services/api";
import './styles.css'
import './stylespriority.css'



function Notes({ data, handleDelete, handleChangePriority }) {
  const [changedNote, setChangedNote] = useState('')
  //função para quando user editar informação do note
  // também mudar anotação no banco de dados
  //console.log(changedNote)
async function handleSave(e, notes) {

    if (changedNote && changedNote !== notes) {
      await api.post(`/contents/${data._id}`, {
        notes: changedNote
      })
    
    }
  }
  return (
    <>
      <li className={data.priority ? 'notepad-infos-priority' :
        "notepad-infos"}>
        <div key={data.id}>
          <strong>{data.title}</strong>
          <div>
            <AiTwotoneDelete
             size={"20"} 
             onClick={()=> handleDelete(data._id)}/>
          </div>
        </div>
        <textarea
          defaultValue={data.notes}
          onChange={e => setChangedNote(e.target.value)}
          onBlur={(e) => handleSave(e.target.data)}
        />
        <span>
          <AiOutlineExclamationCircle
           size={"20"}
           onClick={()=>handleChangePriority(data._id)}
           />
           
          </span>
      </li>
    </>
  )
}
export default Notes;