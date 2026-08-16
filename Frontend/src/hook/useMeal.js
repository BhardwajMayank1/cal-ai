import { useState, useRef, useEffect } from 'react'
import { analyzeMeal, getMealById } from '../services/mealApi'

const POLL_INTERVAL_MS = 2000

export const useMealAnalysis = () => {
    const [meal, setMeal] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)
    const pollTimer = useRef(null)

    const stopPolling = () => {
        if (pollTimer.current) {
            clearInterval(pollTimer.current)
            pollTimer.current = null
        }
    }

    useEffect(() => stopPolling, [])

    const startAnalysis = async (imageFile) => {
        setError(null)
        setUploading(true)
        try {
            const created = await analyzeMeal(imageFile)
            setMeal(created)
            setUploading(false)

            pollTimer.current = setInterval(async () => {
                try {
                    const updated = await getMealById(created._id)
                    setMeal(updated)
                    if (updated.status === 'completed' || updated.status === 'failed') {
                        stopPolling()
                    }
                } catch (err) {
                    stopPolling()
                    setError('Lost connection while checking analysis status.')
                }
            }, POLL_INTERVAL_MS)
        } catch (err) {
            setUploading(false)
            setError(err.response?.data?.message || 'Upload failed. Please try again.')
        }
    }

    const resetMeal = () => {
        stopPolling()
        setMeal(null)
        setError(null)
    }

    return { meal, uploading, error, startAnalysis, resetMeal }
}