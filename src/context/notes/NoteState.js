import NoteContext from './noteContext';
import { useState } from "react";


const NoteState = (props) => {
    const host = "http://localhost:5000"
    const notesInitial = []
    const [notes, setNotes] = useState(notesInitial)

    // Get all Note
    const getNotes = async () => {
        //  API CALL
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            },
        });
        const json = await response.json()
        setNotes(json)
    }

    // Add a Note
    const addNote = async (title, description, tag) => {
        // TODO: API CALL
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjNmMTA3YzQwZDFjYjM5ZjBlMzZkMjQ0In0sImlhdCI6MTY3NjgxMDY2MH0.aH-_1DZW9jKY6wW-PTfmz2PVN9iGQt2rIA1LgP2pLTM'
            },
            body: JSON.stringify({ title, description, tag })
        });

        const json = await response.json();

        const note = {
            "_id": "63f22f1b32183afasdf3dafc5a0f83",
            "user": "63f107c40d1cb39f0e36d244",
            "title": title,
            "description": description,
            "tag": tag,
            "date": "2023-02-19T14:15:55.671Z",
            "__v": 0
        };
        setNotes(notes.concat(note))
    }
    // Delete a Note

    const deleteNote = async (id) => {
        // API CALL
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjNmMTA3YzQwZDFjYjM5ZjBlMzZkMjQ0In0sImlhdCI6MTY3NjgxMDY2MH0.aH-_1DZW9jKY6wW-PTfmz2PVN9iGQt2rIA1LgP2pLTM'
            },
        });
        const json = response.json();
console.log(json)
        const newNotes = notes.filter((note) => { return note._id !== id })
        setNotes(newNotes)
    }

    // Edit a Note
    const editNote = async (id, title, description, tag) => {

        //API Call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjNmMTA3YzQwZDFjYjM5ZjBlMzZkMjQ0In0sImlhdCI6MTY3NjgxMDY2MH0.aH-_1DZW9jKY6wW-PTfmz2PVN9iGQt2rIA1LgP2pLTM'
            },
            body: JSON.stringify({ title, description, tag })
        });
         const json = await response.json();
         console.log(json)

        let newNotes = JSON.parse(JSON.stringify(notes))
        // Logic to edit in client
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = title;
            }
            break;

        }
        setNotes(newNotes)
    }


    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;