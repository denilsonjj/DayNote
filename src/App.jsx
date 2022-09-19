import React, { useState, useEffect } from "react";
import api from "./services/api"
import Notes from "./components/Notes.jsx";
import { Radio } from "@mui/material";

import "./app.css"
import "./global.css"
import "./Sidebar.css"
import "./main.css"

function App() {
  const [selectedValue, setSelectedValue] = useState('all')
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [allNotes, setAllNotes] = useState([])

  useEffect(() => {
    getAllNotes()
  }, [notes, title])

  async function getAllNotes() {
    const response = await api.get("/annotations",);
    setAllNotes(response.data);
  }


  function handleChange(e, n) {
    setSelectedValue(e.value);

    if(e.checked && e.value !== 'all' ){
      loadNotes(e.value);
    } else{
      getAllNotes()
    }
};

  async function loadNotes(option){
    const params = {priority: option}
    const response = await api.get(`/priorities`, { params });
    if (response) {
      setAllNotes(response.data)
    }
  }


  async function handleDelete(id) {
    const deletedNote = await api.delete(`/annotations/${id}`);
    if (deletedNote) {
      setAllNotes(allNotes.filter(notes => notes._id !== id));
    }
  }

  async function handleChangePriority(id) {
    const note = await api.post(`/priorities/${id}`);
    
    if (note && selectedValue !== "all") {
     loadNotes(selectedValue) ;
    } else if(note){
      getAllNotes();
    }
  }
  async function handleSubmit(e) {
    e.preventDefault()

    const response = await api.post('/annotations', {
      title,
      notes,
      priority: false
    })

    setTitle('')
    setNotes('')

    if (selectedValue !== "all") {
      getAllNotes();
    }else{
      setAllNotes([...allNotes, response.data])
    }

    
  }
  useEffect(() => {
    function enableSubmitButton() {
      let btn = document.getElementById('btn')
      btn.style.backgroundColor = "#FFD3CA"
      if (title && notes) {
        btn.style.background = "#EB8F7A"
      }
    }
    enableSubmitButton()
  }, [title, notes])
  // eslint-disable-next-line
  return (
    <div id="app">
      <aside>
        <strong>Caderno de notas</strong>
        <form onSubmit={handleSubmit}>
          <div className="input-block">
            <label htmlFor="title">Titulo da anotação</label>
            <input
              required
              maxLength={"30"}
              value={title}
              onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="input-block">
            <label htmlFor="nota">Anotação</label>
            <textarea
              value={notes}
              required
              onChange={e => setNotes(e.target.value)}></textarea>
          </div>
          <button id="btn" type="submit">salvar</button>
        </form>
        <div className="radioOptions">
            <div>
               <Radio

                    sx={{
                        color: '#FFD3CA',
                        '&.Mui-checked': {
                            color: '#EB8F7A',
                        },
                    }}
                checked={selectedValue === "all"}
                onChange={e => handleChange(e.target)}
                value="all"
                />
                <span>Todos</span>   
            </div>
            <div>
               <Radio
            
                    sx={{
                        color: '#FFD3CA',
                        '&.Mui-checked': {
                            color: '#EB8F7A',
                        },
                    }}
                checked= {selectedValue === "true"}
                onChange={(e) => handleChange(e.target)}
                value="true"
                />
                <span>Prioridades</span>   
            </div>
            <div>
              <Radio
                    sx={{
                        color: '#FFD3CA',
                        '&.Mui-checked': {
                            color: '#EB8F7A',
                        },
                      }}
                      checked= {selectedValue === "false"}
                onChange={e => handleChange(e.target)}
                value="false"
                />
                  <span>Normal</span>   
            </div>
        </div>
      </aside>
      <main>
        <ul>
          {allNotes.map(data =>
          (
            <Notes
              key={data.id}
              data={data}
              handleDelete={handleDelete}
              handleChangePriority={handleChangePriority}
            />
          )
          )}
         

        </ul>
      </main>
    </div>
  );
}
export default App;


