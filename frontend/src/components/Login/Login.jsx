
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {handleSuccess, handleError} from '../../Utils.jsx';
import {ToastContainer } from 'react-toastify';

const Login = () => {

  const [loginInfo, setLoginInfo] = useState({email: '', password: ''});
  
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token && (window.location.pathname === '/login' || window.location.pathname === '/signup')) {
      navigate('/expenses');
    } else if (!token && window.location.pathname === '/expenses') {
      navigate('/login');
    }
  }, [token, navigate]);
  
  

  const handleChange = (e) => {
    setLoginInfo({ email: "", password: "" });
      const {name,value} = e.target;
      const copyLoginInfo = {...loginInfo};
      copyLoginInfo[name] = value;

      setLoginInfo(copyLoginInfo);
  }

  const handleSignup = async(e) => {
    e.preventDefault();
    
    const {email, password} = loginInfo;

    if(!email || !password){
        return handleError(" Email and Password are compulsory ");
    }
    
    try {
     const url = "http://localhost:3000/auth/login";
      const response = await fetch(url,
            {
                method: "POST",
                body: JSON.stringify(loginInfo),
                headers: {
                    "Content-Type":"application/json"
                }
            }
        );

       const result = await response.json();

       const {success, message, error,jwtToken,_id , name} = result;

       if(success){
         handleSuccess(message);
         localStorage.setItem('token', jwtToken);
         localStorage.setItem('loggedInUser',name);
         localStorage.setItem('userId',_id);
         setTimeout(()=>{
            navigate('/expenses');
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
      <h2>Log In</h2>

        <label htmlFor="email">Email</label>
        <input className='signup-login-input' onChange={handleChange} type="email" name='email' 
            autoFocus
                placeholder='Enter your email'
                value={loginInfo.email}
        />

        <label htmlFor="password">Password</label>
        <input className='signup-login-input' onChange={handleChange} type="password" name='password' 
            autoFocus
                placeholder='Enter your password'
                value={loginInfo.password}
        />

        <button className='signup-btn'>Log In</button>
        <p>Not Registered Yet. Sign Up here <Link to={'/signup'}>Sign Up</Link></p>
      </form>
      {/* <ToastContainer/> */}
    </div>
    </>
  )
}

export default Login;