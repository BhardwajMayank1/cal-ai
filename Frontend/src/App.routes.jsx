import { createBrowserRouter, Navigate } from 'react-router-dom' // Fixed import
import Login from './Pages/Login'
import Register from './Pages/Register'
import Protected from './protected/ProtectedRoute'
import Goals from './Pages/Goals'
import Home from './Pages/Home'
import Meal from './Pages/Meal'

export const router = createBrowserRouter([
    {
        // Redirect home domain "/" directly to "/login" (or "/home")
        path: '/',
        element: <Navigate to="/login" replace />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/goals',
        element: <Protected><Goals /></Protected>
    },
    {
        path: '/meal',
        element: <Protected><Meal /></Protected>
    },
    {
        path: '/home',
        element: <Protected><Home /></Protected>
    },
    {
        // Catch-all route for invalid URLs
        path: '*',
        element: <Navigate to="/login" replace />
    }
])