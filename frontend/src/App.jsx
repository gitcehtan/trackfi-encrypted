
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css'
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import About from './components/About/About';
import Expenses from './components/Expenses/Expenses';

function App() {
  

  return (
   <>
     <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/expenses' element={<Expenses/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/about' element={<About/>}/>
        </Routes>
        <Footer/>
     </BrowserRouter>
   </>
  )
}

export default App
