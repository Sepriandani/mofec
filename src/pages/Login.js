import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'
import Logo from '../assets/logo.png'
import { useState } from 'react'
import { auth } from '../firebase-config'
import { signInWithEmailAndPassword } from 'firebase/auth'

export default function Login() {

    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const login = async () => {
        try{
            const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            console.log(user);
            navigate('/')
        }catch(error){
            setError('Login gagal! pastikan email/password sudah benar')
        }
    }

    return(
        <div className="min-h-screen relative flex justify-around items-center flex-col md:flex-row mx-5">
            <div className="lg:p-10">
                <h1 className="text-4xl font-bold text-gray-800 m-auto">WELCOME TO</h1>
                <img src={Logo} className="w-60" alt=''/>
            </div>
            <div className="bg-gray-50 shadow-md p-5 md:p-10 rounded-md hover:shadow-lg w-full md:w-1/2 lg:w-1/3">
                <h1 className="text-xl md:text-3xl text-center font-bold md:font-semibold text-gray-800 mb-5">Login</h1>
                {error && <div className="bg-red-100 ring-1 ring-red-200 my-10 text-center p-4 rounded-md">{error}</div>}

                <div id="login-form" className="flex flex-col mb-3">
                    <label for="input-email" className="text-gray-500 ml-1 text-sm md:text-base font-semibold mb-1">Email</label>
                    <input
                        onChange={(e) => {
                            setLoginEmail(e.target.value)
                        }}
                        type="text"
                        id="input-email"
                        className="p-2 rounded-md shadow-sm focus:shadow-md mb-3 border border-gray-400 bg-gray-100"
                        required
                    />
            
                    <label for="input-password" className="text-gray-500 ml-1 text-sm md:text-base font-semibold mb-1">password</label>
                    <input
                        onChange={(e) => {
                            setLoginPassword(e.target.value)
                        }}
                        type="password"
                        id="input-password" 
                        className="p-2 mb-5 rounded-md shadow-sm focus:shadow-md border border-gray-400 bg-gray-100"
                        required
                    />

                    <div className='text-yellow-700'>
                        <Link to="/register">
                            <FontAwesomeIcon icon={faArrowRightLong} className='mr-2' />
                            Daftar
                        </Link>
                    </div>

                    <button onClick={login} id="login-button" type="submit" className="text-center bg-yellow-400 p-2 mt-5 rounded-md text-gray-800 font-semibold shadow-sm hover:shadow-md">Login</button>
                   
                </div>
            </div>
            <div className="absolute bottom-10 left-20 w-1/2 text-gray-800 hidden md:block">
                <h1 className="text-xl font-bold">Always Connected, Always Secure</h1>
                <p className="font-medium">MOFEC is a portable product that monitors the measurement results of Current, Voltage and I-V curves by connected the product to a cable and transmitting the measurement results.</p>
            </div>
        </div>

    )
}