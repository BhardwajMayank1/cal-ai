import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hook/useAuth'
import { useState } from 'react'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            await handleLogin({ email, password })
            navigate('/home')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
        } finally {
            setSubmitting(false)
        }
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
                <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome back</h1>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" id="email" name="email"
                            placeholder="Enter your email"
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
                            placeholder="Enter your password"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <button
                        disabled={submitting}
                        className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {submitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="text-sm text-gray-600 text-center mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 font-medium hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </main>
    )
}

export default Login