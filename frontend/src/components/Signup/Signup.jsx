import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Signup.css";
import {handleSuccess, handleError} from '../../Utils.jsx';
import {ToastContainer } from 'react-toastify';

const Signup = () => {

  const [signupInfo, setSignupInfo] = useState({name:'', email: '', password: '',secretKey: ''});
  
  const navigate = useNavigate();

  const handleChange = (e) => {
      const {name,value} = e.target;
      const copySignupInfo = {...signupInfo};
      copySignupInfo[name] = value;

      setSignupInfo(copySignupInfo);
  }

  const handleSignup = async(e) => {
    e.preventDefault();
    
    const {name, email, password,secretKey} = signupInfo;

    if(! name || !email || !password || !secretKey){
        return handleError("Name , Email, Password and Secret Key are compulsory ");
    }
    
    try {
     const url = "http://localhost:3000/auth/signup";
      const response = await fetch(url,
            {
                method: "POST",
                body: JSON.stringify(signupInfo),
                headers: {
                    "Content-Type":"application/json"
                }
            }
        );

       const result = await response.json();

       const {success, message, error} = result;

       if(success){
         handleSuccess(message);
         setTimeout(()=>{
            navigate('/login');
         },1000);
       } else if(error){
        const detail = error.details[0].message;
        handleError(detail);
       } else if(!success){
        handleError(message);
       }

       console.log(result);
       

    } catch (error) {
        handleError(error);
    }

  }

  return (
    <>
        <div className='signup'>
      <form onSubmit={handleSignup}>
      <h2>Sign Up</h2>
        <label htmlFor="name">Name</label>
        <input className='signup-login-input'  onChange={handleChange} 
                type="text" 
                name='name' 
                autoFocus
                placeholder='Enter your name'
                value={signupInfo.name}/>

        <label htmlFor="email">Email</label>
        <input className='signup-login-input' onChange={handleChange} 
               type="email" 
               name='email' 
               autoFocus
                placeholder='Enter your email'
                value={signupInfo.email}
        />

        <label htmlFor="password">Password</label>
        <input className='signup-login-input' onChange={handleChange} type="password" name='password' 
            autoFocus
                placeholder='Enter your password'
                value={signupInfo.password}
        />

        <label htmlFor="secretKey">Secret Key</label>
        <input className='signup-login-input' onChange={handleChange} type="password" name='secretKey' 
            autoFocus
                placeholder='Enter your Secret Key'
                value={signupInfo.secretKey}
        />

        <button className='signup-btn'>SignUp</button>
        <p>If Already Registered. Login here <Link to={'/login'}>Login</Link></p>
      </form>
      {/* <ToastContainer/> */}
    </div>
    </>
  )
}

export default Signup;