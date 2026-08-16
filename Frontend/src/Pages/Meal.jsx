import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useMealAnalysis } from '../hook/useMeal'
import { useDashboard } from '../hook/useDashboard'

const MealPage = () => {
    const { meal, uploading, error, startAnalysis, resetMeal } = useMealAnalysis()
    const { consumed, goals, loading: dashboardLoading, refetch } = useDashboard()
    const [preview, setPreview] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)

    // once analysis finishes, blank the upload box and pull fresh totals
    useEffect(() => {
        if (meal?.status === 'completed' || meal?.status === 'failed') {
            setPreview(null)
            setSelectedFile(null)
            if (meal.status === 'completed') refetch()
        }
    }, [meal?.status, refetch])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setSelectedFile(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedFile) return
        await startAnalysis(selectedFile)
    }

    const handleLogAnother = () => {
        resetMeal()
        setPreview(null)
        setSelectedFile(null)
    }

    const isProcessing = meal?.status === 'processing'

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Log a meal</h1>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
                        {error}
                    </p>
                )}

                {!meal && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label
                            htmlFor="meal-image"
                            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-400 transition-colors"
                        >
                            {preview ? (
                                <img src={preview} alt="meal preview" className="w-full max-h-56 object-cover rounded-lg" />
                            ) : (
                                <>
                                    <span className="text-3xl">🍽️</span>
                                    <span className="text-sm text-gray-500">Tap to select a photo of your meal</span>
                                </>
                            )}
                            <input
                                type="file"
                                id="meal-image"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>

                        <button
                            disabled={!selectedFile || uploading}
                            className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {uploading ? 'Uploading...' : 'Analyze meal'}
                        </button>
                    </form>
                )}

                {isProcessing && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        Analyzing your meal... this may take a moment.
                    </div>
                )}

                {meal?.status === 'completed' && (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{meal.foodName}</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Portion: {meal.portionEstimate} · Confidence: {meal.confidence}
                        </p>
                        <ul className="grid grid-cols-2 gap-3 mt-4">
                            <li className="bg-gray-50 rounded-lg px-3 py-2">
                                <span className="block text-xs text-gray-500">Calories</span>
                                <span className="text-sm font-medium text-gray-900">{meal.nutrition?.calories}</span>
                            </li>
                            <li className="bg-gray-50 rounded-lg px-3 py-2">
                                <span className="block text-xs text-gray-500">Protein</span>
                                <span className="text-sm font-medium text-gray-900">{meal.nutrition?.protein}g</span>
                            </li>
                            <li className="bg-gray-50 rounded-lg px-3 py-2">
                                <span className="block text-xs text-gray-500">Carbs</span>
                                <span className="text-sm font-medium text-gray-900">{meal.nutrition?.carbs}g</span>
                            </li>
                            <li className="bg-gray-50 rounded-lg px-3 py-2">
                                <span className="block text-xs text-gray-500">Fat</span>
                                <span className="text-sm font-medium text-gray-900">{meal.nutrition?.fat}g</span>
                            </li>
                        </ul>

                        <div className="flex gap-3 mt-5">
                            <Link
                                to="/"
                                className="flex-1 text-center bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Go to dashboard
                            </Link>
                            <button
                                onClick={handleLogAnother}
                                className="flex-1 bg-gray-100 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                                Log another
                            </button>
                        </div>
                    </div>
                )}

                {meal?.status === 'failed' && (
                    <div>
                        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                            Analysis failed: {meal.errorMessage || 'Unknown error'}
                        </p>
                        <button
                            onClick={handleLogAnother}
                            className="w-full bg-gray-100 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors mt-4"
                        >
                            Try again
                        </button>
                    </div>
                )}
            </div>

            {!dashboardLoading && goals && (
                <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-700">Today so far</h2>
                        <Link to="/home" className="text-xs text-blue-600 hover:underline">
                            View full dashboard
                        </Link>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        {consumed.calories} / {goals.calories} cal · {consumed.mealCount} meal{consumed.mealCount !== 1 ? 's' : ''} logged
                    </p>
                </div>
            )}
        </main>
    )
}

export default MealPage