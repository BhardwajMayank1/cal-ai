import { Link } from 'react-router'
import { useDashboard } from '../hook/useDashboard'

const NutrientBar = ({ label, consumed, goal }) => {
    const safeGoal = goal || 0
    const remaining = safeGoal - consumed
    const percent = safeGoal > 0 ? Math.min((consumed / safeGoal) * 100, 100) : 0
    const isOver = remaining < 0

    return (
        <div className="mb-5">
            <div className="flex justify-between text-sm mb-1.5">
                <span className="font-semibold text-gray-800">{label}</span>
                <span className="text-gray-600">
                    {consumed} / {safeGoal}
                    {isOver ? ` (${Math.abs(remaining)} over)` : ` (${remaining} left)`}
                </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-300 ${
                        isOver ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    )
}

const Home = () => {
    const { consumed, goals, meals, loading, error } = useDashboard()

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <h1 className="text-lg text-gray-600">Loading...</h1>
            </main>
        )
    }

    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center px-4">
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                </p>
            </main>
        )
    }

    if (!goals) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome</h1>
                    <p className="text-sm text-gray-600 mb-6">You haven't set any goals yet.</p>
                    <Link
                        to="/goals"
                        className="inline-block bg-blue-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        Set your goals
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Today's progress</h1>
                    <Link to="/goals" className="text-sm text-blue-600 hover:underline">
                        Edit goals
                    </Link>
                </div>

                <NutrientBar label="Calories" consumed={consumed.calories} goal={goals.calories} />
                <NutrientBar label="Protein" consumed={consumed.protein} goal={goals.protein} />
                <NutrientBar label="Carbs" consumed={consumed.carbs} goal={goals.carbs} />
                <NutrientBar label="Fat" consumed={consumed.fat} goal={goals.fat} />

                <p className="text-sm text-gray-500 mt-6 border-t border-gray-100 pt-4">
                    {consumed.mealCount} meal{consumed.mealCount !== 1 ? 's' : ''} logged today
                </p>

                {meals.length > 0 && (
                    <div className="mt-6 border-t border-gray-100 pt-5">
                        <h2 className="text-sm font-semibold text-gray-700 mb-3">Today's meals</h2>
                        <ul className="space-y-3">
                            {meals.map((meal) => (
                                <li key={meal._id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2.5">
                                    <img
                                        src={meal.imageUrl}
                                        alt={meal.foodName}
                                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{meal.foodName}</p>
                                        <p className="text-xs text-gray-500">
                                            {meal.nutrition?.calories} cal · {meal.nutrition?.protein}g protein
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <Link
                    to="/meal"
                    className="block text-center w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors mt-4"
                >
                    Log a meal
                </Link>
            </div>
        </main>
    )
}

export default Home