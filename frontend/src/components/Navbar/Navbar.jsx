import React from 'react'
import "./Navbar.css";
import { Link , useNavigate} from 'react-router-dom';
import { handleSuccess } from '../../Utils';


const Navbar = () => {
  
  const navigate = useNavigate();
  let loggedInUser = localStorage.getItem('loggedInUser');
  let token = localStorage.getItem('token');

  const handleLogout = async(e) => {

    const response = await fetch('http://localhost:3000/expenses/logout', {
      method: 'POST',
      headers: {
          Authorization: localStorage.getItem('token'), // Replace with your auth token logic
          'Content-Type': 'application/json',
      },
    });

  const result = await response.json();

  if (result.success) {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userId');
    sessionStorage.removeItem("myKey");
    handleSuccess(result.message)
    setTimeout(() => {
        navigate('/login');
    },1000);
    
} else {
    console.error('Logout failed:', result.message);
}

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