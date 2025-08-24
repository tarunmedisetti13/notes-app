import React, { useState, useEffect } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"

const Home = () => {
    const [notes, setNotes] = useState([])
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [modalAction, setModalAction] = useState(null)
    const [noteIdToModify, setNoteIdToModify] = useState(null)

    const navigate = useNavigate()

    // Fetch notes
    const getNotes = () => {
        api.get("/api/notes/").then((res) => setNotes(res.data)).catch((err) => console.error(err))
    }

    // Delete note
    const deleteNote = (id) => {
        api.delete(`/api/notes/delete/${id}/`).then((res) => {
            if (res.status === 204) getNotes()
        }).catch((err) => console.error(err))
    }

    // Update note
    const updateNote = () => {
        if (!noteIdToModify) return
        api.put(`/api/notes/edit/${noteIdToModify}/`, { title, content })
            .then((res) => {
                if (res.status === 200) {
                    setTitle("")
                    setContent("")
                    setNoteIdToModify(null)
                    setShowModal(false)
                    getNotes()
                }
            })
            .catch((err) => console.error(err))
    }

    // Create note
    const createNote = (e) => {
        e.preventDefault()
        api.post("/api/notes/", { title, content })
            .then((res) => {
                if (res.status === 201) {
                    setTitle("")
                    setContent("")
                    getNotes()
                }
            })
            .catch((err) => console.error(err))
    }

    // Logout
    const logout = () => {
        localStorage.removeItem(ACCESS_TOKEN)
        localStorage.removeItem(REFRESH_TOKEN)
        navigate("/login")
    }

    // Open modal for delete, logout, or edit
    const openModal = (action, note = null) => {
        setModalAction(action)
        if (action === "edit" && note) {
            setTitle(note.title)
            setContent(note.content)
            setNoteIdToModify(note.id)
        } else if (action === "delete") {
            setNoteIdToModify(note.id)
        }
        setShowModal(true)
    }

    // Confirm modal action
    const confirmAction = () => {
        if (modalAction === "logout") logout()
        else if (modalAction === "delete" && noteIdToModify) deleteNote(noteIdToModify)
        setShowModal(false)
    }

    useEffect(() => { getNotes() }, [])

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 relative">
            <div className="w-full max-w-2xl">
                {/* Header with Logout */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">📝 My Notes</h2>
                    <button
                        onClick={() => openModal("logout")}
                        className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
                    >
                        🚪 Logout
                    </button>
                </div>

                {/* Create Note Form */}
                <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Create a Note</h3>
                    <form onSubmit={createNote} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Title"
                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Content"
                            rows="4"
                            className="border border-gray-300 p-3 rounded-lg resize-none focus:ring-2 focus:ring-blue-400 outline-none"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white cursor-pointer py-2 rounded-lg shadow hover:bg-blue-700 transition"
                        >
                            ➕ Add Note
                        </button>
                    </form>
                </div>

                {/* Notes List */}
                <div className="grid gap-4">
                    {notes.length > 0 ? (
                        notes.map((note) => (
                            <div
                                key={note.id}
                                className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition flex justify-between items-start"
                            >
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800">{note.title}</h4>
                                    <p className="text-gray-600 mt-1">{note.content}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal("edit", note)}
                                        className="cursor-pointer bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500 transition"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => openModal("delete", note)}
                                        className="cursor-pointer bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No notes yet. Create one above!</p>
                    )}
                </div>
            </div>

            {/* Modal for Delete, Logout, or Edit */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-xs">

                    <div className="bg-white  border-gray-500 border-2 p-6 rounded-2xl shadow-lg w-96 text-center relative z-10 ">
                        {modalAction === "edit" ? (
                            <>
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                    Edit Note
                                </h3>
                                <input
                                    type="text"
                                    className="border border-gray-300 p-2 rounded w-full mb-3"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <textarea
                                    rows="4"
                                    className="border resize-none border-gray-300 p-2 rounded w-full mb-3"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                ></textarea>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={updateNote}
                                        className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                                    >
                                        💾 Save
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="bg-gray-300  cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                    {modalAction === "logout"
                                        ? "Are you sure you want to logout?"
                                        : "Are you sure you want to delete this note?"}
                                </h3>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={confirmAction}
                                        className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="cursor-pointer bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home
