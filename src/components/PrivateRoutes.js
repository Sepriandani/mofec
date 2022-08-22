import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from "firebase/auth"
import { useState } from "react"
import { auth } from '../firebase-config'



export default function PrivateRoutes() {

    const [user, setUser] = useState({})
    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser)
    })

    return (
        <>
            {user ? <Outlet  /> : <Navigate to="/login" />};
        </>

    )

}