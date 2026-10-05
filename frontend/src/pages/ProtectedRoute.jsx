import React from 'react'
import { Navigate,Outlet } from 'react-router-dom';

const ProtectedRoute = () => {

    const user = JSON.parse(localStorage.getItem('user'));
    if(user){
        return <Outlet />
    }
    else{
        return <Navigate to="/register" />
    }

}

export default ProtectedRoute
