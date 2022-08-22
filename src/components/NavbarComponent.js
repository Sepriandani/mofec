import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.png'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase-config'


function handleClick(e){
    const hamburger = document.querySelector('#hamburger');
    const menu = document.querySelector('#menu');
    
    e.preventDefault();
    hamburger.classList.toggle('hamburger-active');
    menu.classList.toggle('hidden');
}


export default function NavbarComponent(){

    const navigate = useNavigate()
    const logout = async () =>{
        await signOut(auth)
        navigate('/login')
    }

    return(
        <>
            <header className="bg-yellow-500 w-full py-4 px-5 lg:px-40 absolute top-0 left-0 flex items-center z-10">
                <div className="container">
                    <div className="flex justify-between items-center w-full relative">
                        <div className="hover:cursor-pointer">
                            <img src={Logo} alt="" className="w-8 lg:w-14"/>
                        </div>
                        <div className="flex items-center lg:hidden">
                            <button id="hamburger" name="hamburger" type="button" onClick={handleClick}>
                                <span className="hamburger-line transition duration-300 ease-in-out origin-top-left "></span>
                                <span className="hamburger-line transition duration-300 ease-in-out"></span>
                                <span className="hamburger-line transition duration-300 ease-in-out origin-bottom-left"></span>
                            </button>
                        </div>
                        <nav id="menu" className="bg-yellow-500 hidden px-5 lg:block lg:static lg:bg-transparent lg:max-w-full absolute py-5 shadow-lg lg:shadow-none rounded-sm lg:rounded-none w-3/4 md:w-1/2 lg:w-auto -right-5 md:-right-10 top-full h-screen lg:h-fit">
                            <div className="flex flex-col lg:flex-row gap-5 lg:gap-10">
                                <ul className="flex flex-col lg:flex-row gap-5 lg:gap-10 text-gray-50 font-semibold">
                                    <li className="hover:text-gray-600 cursor-pointer text-lg">
                                        <Link to="/">
                                            Pengukuran
                                        </Link>
                                    </li>
                                    <li className="hover:text-gray-600 cursor-pointer text-lg">
                                        <Link to="/kurva">
                                            Kurva
                                        </Link>
                                    </li>
                                    <li className="hover:text-gray-600 cursor-pointer text-lg">
                                        <Link to="/about">
                                            About
                                        </Link>
                                    </li>
                                </ul>
                                <button onClick={logout} type='button' className="text-md rounded-md lg:rounded-md hover:shadow-md hover:ring-1  cursor-pointer py-2 px-3 bg-white ring-gray-200 lg:text-base text-center font-semibold text-gray-800 hover:text-gray-600">
                                    Logout
                                </button>

                            </div>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    )
}