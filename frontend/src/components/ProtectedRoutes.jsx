import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useState, useEffect } from "react"

function ProtectedRoutes({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null)

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
        // eslint-disable-next-line
    }, [])

    const refreshToken = async () => {
        const refresh = localStorage.getItem(REFRESH_TOKEN)
        try {
            const res = await api.post("/api/token/refresh/", { refresh })
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error)
            setIsAuthorized(false)
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            setIsAuthorized(false)
            return
        }

        const decode = jwtDecode(token)
        const expirationDate = decode.exp
        const now = Date.now() / 1000

        if (expirationDate < now) {
            await refreshToken()
        } else {
            setIsAuthorized(true)
        }
    }

    // 🟢 render logic here
    if (isAuthorized === null) {
        return <div>Loading...</div>
    }

    if (isAuthorized) {
        return children
    }

    return <Navigate to="/login" replace />
}

export default ProtectedRoutes
