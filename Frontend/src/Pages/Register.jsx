import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
import { useState } from 'react'

const Register = () => {
    const navigate = useNavigate()
    const { loading, handleRegister } = useAuth()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [avatar, setAvatar] = useState(null)
    const [preview, setPreview] = useState(null)
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            await handleRegister({ username, email, password, avatar })
            navigate('/goals')
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleAvatar = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setAvatar(file)
        setPreview(URL.createObjectURL(file))
    }

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <h1 className="text-lg text-gray-600">Loading...</h1>
            </main>
        )
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create your account</h1>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                            {preview
                                ? <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                                : <span className="text-2xl">👤</span>
                            }
                        </div>
                        <label htmlFor="avatar" className="text-sm text-blue-600 cursor-pointer hover:underline">
                            Choose avatar
                            <input
                                type="file" id="avatar" name="avatar"
                                accept="image/*"
                                onChange={handleAvatar}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            type="text" id="username" name="username"
                            placeholder="Enter your username"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" id="email" name="email"
                            placeholder="Enter email"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password" id="password" name="password"
                            placeholder="Enter password"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <button
                        disabled={submitting}
                        className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {submitting ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <p className="text-sm text-gray-600 text-center mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </main>
    )
}

export default Register