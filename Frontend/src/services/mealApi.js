import api from './api'

export async function analyzeMeal(imageFile) {
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await api.post('/meal/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
}

export async function getMealById(id) {
    const response = await api.get(`/meal/${id}`)
    return response.data
}

export async function deleteMealById(id) {
    const response = await api.delete(`/meal/${id}`)
    return response.data
}