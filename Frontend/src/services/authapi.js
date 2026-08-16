import api from './api'

export async function register({ username, email, password, avatar }) {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    if (avatar) formData.append('avatar', avatar)

    const response = await api.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
}

export async function login({ email, password }) {
    const response = await api.post('/auth/login', { email, password })
    return response.data
}

export async function logout() {
    const response = await api.post('/auth/logout')
    return response.data
}

export async function getMe() {
    const response = await api.get('/auth/get')
    return response.data
}
