import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'
import { auth } from '../firebase-config'
import { createUserWithEmailAndPassword } from 'firebase/auth'

export default function Register() {

    const [registerEmail, setRegisterEmail] = useState('')
    const [registerPassword, setRegisterPassword] = useState('')
    const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const register = async () => {
        if(registerPassword !== registerPasswordConfirm){
            return setError('Password tidak sama!')
        }
        try {
            const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
            console.log(user);
            navigate('/')
        } catch (error) {
            setError('Gagal membuat akun!')
        }
    }

  return (
        <div className="min-h-screen flex justify-around items-center flex-col md:flex-row mx-5">
            <div className="bg-gray-50 shadow-md p-5 md:p-10 rounded-md hover:shadow-lg w-full md:w-1/2 lg:w-1/3">
                <h1 className="text-xl md:text-3xl text-center font-bold md:font-semibold text-gray-800 mb-5">Register</h1>
                {error && <div className="bg-red-100 ring-1 ring-red-200 mb-10 text-center p-4 rounded-md">{error}</div>}
                
                <div id="login-form" className="flex flex-col mb-3">
                    <label for="register-email" className="text-gray-500 ml-1 text-sm md:text-base font-semibold mb-1">Email</label>
                    <input
                        onChange={(e) => [
                            setRegisterEmail(e.target.value)
                        ]}
                        type="text" 
                        id="register-email" 
                        className="p-2 rounded-md shadow-sm focus:shadow-md mb-3 border border-gray-400 bg-gray-100"
                        required
                    />
            
                    <label for="register-password" className="text-gray-500 ml-1 text-sm md:text-base font-semibold mb-1">Password</label>
                    <input
                        onChange={(e) => {
                            setRegisterPassword(e.target.value)
                        }}
                        type="password"
                        id="register-password" 
                        className="p-2 mb-5 rounded-md shadow-sm focus:shadow-md border border-gray-400 bg-gray-100" 
                        required 
                    />
            
                    <label for="register-password-confirm" className="text-gray-500 ml-1 text-sm md:text-base font-semibold mb-1">Password confirm</label>
                    <input 
                        onChange={(e) => {
                            setRegisterPasswordConfirm(e.target.value)
                        }}
                        type="password" 
                        id="register-password-confirm" 
                        className="p-2 mb-5 rounded-md shadow-sm focus:shadow-md border border-gray-400 bg-gray-100" 
                        required 
                    />

                    <div className='text-yellow-700'>
                        <Link to="/login">
                            <FontAwesomeIcon icon={faArrowLeftLong} className='mr-2' />
                            Kembali ke halaman login
                        </Link>
                    </div>

                    <button onClick={register} id="login-button" type="submit" className="text-center bg-yellow-400 p-2 mt-5 rounded-md text-gray-800 font-semibold shadow-sm hover:shadow-md">Register</button>
                </div>
            </div>
        </div>
  )
}
