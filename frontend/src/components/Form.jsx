import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'
import { Link } from 'react-router-dom'
const Form = ({ route, method }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await api.post(route, { username, password })
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {
            alert("Invalid credentials or something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    const name = method === "login" ? "Login" : "Register"

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm flex flex-col gap-6"
            >
                <h1 className="text-2xl font-bold text-center text-gray-700">
                    {name} to Task Manager
                </h1>

                <div className="flex flex-col gap-4">
                    <input
                        className="border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    disabled={loading}
                    className={`cursor-pointer py-2 px-4 rounded-lg text-white font-medium transition ${loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                        }`}
                >
                    {loading ? "Loading..." : name}
                </button>

                <p className="text-center text-sm text-gray-500">
                    {method === "login" ? (
                        <>Don’t have an account? <Link to="/register" className="text-blue-500 hover:underline">Register here</Link></>
                    ) : (
                        <>Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login instead</Link></>
                    )}
                </p>


            </form>
        </div >
    )
}

export default Form
