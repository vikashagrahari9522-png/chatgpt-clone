import { BrowserRouter, Routes, Route, createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './pages/ProtectedRoute';

export const AppRouter = createBrowserRouter([
        {
            path: "/",
            element: <ProtectedRoute />,
            children: [
                {
                    path: "/",
                    element: <HomePage />
                }
            ]
        },
        {
            path: "/register",
            element: <RegisterPage />
        },
        {
            path: "/login",
            element: <LoginPage />
        }
]);





