import { useContext } from "react";
import { AuthContext } from '../context/AuthContext'
import { register, login, logout } from '../services/authapi'

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password, avatar }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password, avatar })
               
            setUser(data.User)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    
    return { user, loading, handleRegister, handleLogin, handleLogout }
}