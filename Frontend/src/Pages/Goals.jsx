import { useState, useEffect } from 'react'
import { useGoals } from '../hook/useGoal'
import { useNavigate } from 'react-router'

const Goals = () => {
    const { goals, loading, saveGoals } = useGoals()

    const [calories, setCalories] = useState('')
    const [protein, setProtein] = useState('')
    const [carbs, setCarbs] = useState('')
    const [fat, setFat] = useState('')
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (goals) {
            setCalories(goals.calories ?? '')
            setProtein(goals.protein ?? '')
            setCarbs(goals.carbs ?? '')
            setFat(goals.fat ?? '')
        }
    }, [goals])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            await saveGoals({ calories, protein, carbs, fat })
            navigate('/meal')
        } catch (err) {
            setError(err.response?.data?.message || 'Could not save goals. Please try again.')
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
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    {goals ? 'Update your goals' : 'Set your goals'}
                </h1>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
                            Calories
                        </label>
                        <input
                            required
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                            placeholder="e.g. 2000"
                            type="number" id="calories" name="calories"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-1">
                            Protein (g)
                        </label>
                        <input
                            required
                            value={protein}
                            onChange={(e) => setProtein(e.target.value)}
                            placeholder="e.g. 150"
                            type="number" id="protein" name="protein"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-1">
                            Carbs (g)
                        </label>
                        <input
                            required
                            value={carbs}
                            onChange={(e) => setCarbs(e.target.value)}
                            placeholder="e.g. 250"
                            type="number" id="carbs" name="carbs"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="fat" className="block text-sm font-medium text-gray-700 mb-1">
                            Fat (g)
                        </label>
                        <input
                            required
                            value={fat}
                            onChange={(e) => setFat(e.target.value)}
                            placeholder="e.g. 70"
                            type="number" id="fat" name="fat"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <button
                        disabled={submitting}
                        className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {submitting ? 'Saving...' : 'Save goals'}
                    </button>
                </form>
            </div>
        </main>
    )
}

export default Goals