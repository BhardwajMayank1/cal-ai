import Login from './Pages/Login'
import Register from './Pages/Register'
import Protected from './protected/ProtectedRoute'
import Goals from './Pages/Goals'
import Home from './Pages/Home'
import Meal from './Pages/Meal'
import { createBrowserRouter } from 'react-router'

export const router =createBrowserRouter([
    {
        path:'/login',
        element:<Login />
    },
    {
        path:'/register',
        element:<Register />
    },
    {
        path:'/goals',
        element:
        <Protected><Goals /></Protected>
    },
    {
        path:'/meal',
        element:
        <Protected><Meal /></Protected>
    },
    {
        path:'/home',
        element:
        <Protected><Home /></Protected>
    }


])