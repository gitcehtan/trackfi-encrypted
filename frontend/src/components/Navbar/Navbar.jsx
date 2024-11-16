import React from 'react'
import "./Navbar.css";
import { Link , useNavigate} from 'react-router-dom';
import { handleSuccess } from '../../Utils';


const Navbar = () => {
  
  const navigate = useNavigate();
  let loggedInUser = localStorage.getItem('loggedInUser');
  let token = localStorage.getItem('token');

  const handleLogout = (e) => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userId');
    handleSuccess("User Logged Out")
    setTimeout(() => {
        navigate('/login');
    },1000);
}

  return (
   <div className='navbar'>
    <nav>
        <ul>
        
        <li><Link to={"/"}>TRACKFI</Link></li>
        <li><Link to={"/"}>Home</Link></li>
        <li><Link to={"/about"}>About</Link></li>
        <li><Link to={'/expenses'} >Expenses</Link></li>
        </ul>
        <div className='login-signup'>
        {
          !token  &&  (<><li><Link to={'/login'}>Login</Link></li>
                <li><Link to={'/signup'}>Signup</Link></li></>)
        }

        {  token    &&  (<>
                    <button >{loggedInUser}</button>
                    <button onClick={handleLogout}>Logout</button>
                </>)
        }
        
        </div>
    </nav>
   </div>
//   
/*  */
  )
}

export default Navbar