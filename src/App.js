import './App.css';
import React, { useState, useEffect } from 'react'
import Split from 'react-split';
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import { nanoid } from 'nanoid'

export default function App() {
  // set state for notes
  const [notes, setNotes] = useState(
    () => JSON.parse(localStorage.getItem("notes")) || ""
  )

  // set state for note id
    // if there is an existing note return that id otherwise
    // set it to an empty string
  const [currentNoteId, setCurrentNoteId] = useState(
    (notes[0] && notes[0].id) || ("")
  )

  // a function that saves our notes to localStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  // a function that creates a new note
  function createNewNote() {
    const newNote = {
          id: nanoid(),
          body: "# Type your markdown title here"
    }
    setNotes(prevNotes => [newNote, ...prevNotes])
    setCurrentNoteId(newNote.id)
  }

  // a function that updates the selected note
    //put the recently modified note at the top
  function updateNote(text) {
    setNotes(oldNotes => {
      const newArray = []
      for (let i = 0; i < oldNotes.length; i++) {
        let oldNote = oldNotes[i]
        if (oldNote.id === currentNoteId) {
          newArray.unshift({...oldNote, body: text})
        } else {
          newArray.push(oldNote)
        }
      }
      return newArray
    })
  }

  // a function that deletes a note
  function deleteNote(event, noteId) {
    setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
  }

  // a function that finds the current note
  function findCurrentNote() {
    return notes.find(note => {
      return note.id === currentNoteId
    }) || notes[0]
  }
  
  return (
      <main>
      {
        notes.length > 0
        ?
        <Split 
            sizes={[30, 70]} 
            direction="horizontal" 
            className="split"
        >
            <Sidebar
                notes={notes}
                currentNote={findCurrentNote()}
                setCurrentNoteId={setCurrentNoteId}
                createNewNote={createNewNote}
                deleteNote={deleteNote}
            />
        {
            currentNoteId && 
            notes.length > 0 &&
            <Editor 
                currentNote={findCurrentNote()} 
                updateNote={updateNote} 
            />
        }
    </Split>
        :
        <div className="no-notes">
            <h1>You have no notes</h1>
            <button
                className="first-note"
                onClick={createNewNote}
            >
              Create new note
            </button>
        </div>
      }
      </main>
  );
}
