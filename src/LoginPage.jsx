import React from 'react';
import Form from './components/Form';
import officeBackground from './assets/office.png';
import banner_login from "./assets/banner_login.png";
import Kloudspot  from "./assets/Kloudspot.jsx";


const Logo = () => (
    <div className=" bg-cover bg-center bg-no-repeat w-full h-[100px] flex justify-center items-center" style={{
        backgroundImage: `url(${banner_login})`
    }}>

   <Kloudspot className="w-full h-full"/>
        
    </div>
);

const LoginPage = () => {
    return (
        <div className='min-h-screen relative w-full h-full'>
           
            <div 
                className='absolute inset-0 bg-cover bg-center bg-no-repeat' 
                style={{
                    backgroundImage: `url(${officeBackground})`,
                }}
            />
            
          
            <div className='absolute inset-0 bg-gray-900/60 mix-blend-multiply' />

           
            <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between container mx-auto px-6 lg:px-20 py-10">
                
                <div className="text-white w-full lg:w-1/2 mb-10 lg:mb-0">
                    <h1 className="font-sans font-semibold text-[20px] leading-7 tracking-[0.02em]  sm:text-[24px] sm:leading-8   md:text-[28px] md:leading-9  lg:text-[32px] lg:leading-10   ">
                        Welcome to the<br />
                        Crowd Management System
                    </h1>
                </div>

               
                <div className="w-full max-w-[450px]">
                    <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                        <Logo />
                        <div className="p-8 pb-12">
                            <Form />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;