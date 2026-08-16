import { useState, useEffect, useCallback } from 'react'
import { getSummary } from '../services/dashboard'

export const useDashboard = () => {
    const [consumed, setConsumed] = useState(null)
    const [goals, setGoals] = useState(null)
    const [meals, setMeals] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchSummary = useCallback(async () => {
        try {
            const data = await getSummary()
            setConsumed(data.consumed)
            setGoals(data.goals)
            setMeals(data.meals || [])
        } catch (err) {
            setError('Could not load your dashboard.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchSummary()
    }, [fetchSummary])

    return { consumed, goals, meals, loading, error, refetch: fetchSummary }
}