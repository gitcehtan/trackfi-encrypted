import React, { createContext, useEffect, useState } from 'react'
import './Expenses.css';
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../../Utils';
import { ToastContainer } from 'react-toastify';
import UpdateExpense  from '../Modal/UpdateModal.jsx';

import PieChart from '../Charts/PieChart.jsx';
import Searchbar from '../Searchbar/Searchbar.jsx';
import Pagination from '../Pagination/Pagination.jsx';

export const currPageContext = createContext();
const Expenses = () => {


  
const [loggedInUser, setLoggedInUser] = useState('');
const [expenses, setExpenses] = useState(); // to get expenses
const [displayExpenses, setDisplayExpenses] = useState(); // to display expenses in the UI

const [expenseInfo, setExpenseInfo] = useState({ description: "", category: "",amount:"" }); // for expense creation

const [expense, setExpense] = useState({expenseId:"", description: "", category: "",amount:"" }); // for update expense
let token = localStorage.getItem('token');

// Update Modal Variables
const [isModalOpen, setModalOpen] = useState(false);

const openModal = (expense) => {
    setModalOpen(true)

    setExpense(expense);
};
const closeModal = () => setModalOpen(false);


const navigate = useNavigate();

useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));
    fetchExpenses();
    checkToken(token);
    console.log("Useeffect");
    
    
}, [])



const fetchExpenses = async () => {
    try {
    const url  = "http://localhost:3000/expenses";
    const headers = {
        headers: {
        "Authorization" : token,
        "Content-Type": "application/json"
        }
      }
        const response = await fetch(url, headers);
        const result = await response.json();
        // console.log("Hello  ");
        
        setExpenses(result);
        setDisplayExpenses(result.slice(indexOfFirstItem,indexOfLastItem));
        // console.log("Expenses "+result);
    
    } catch (error) {
        console.log("errrir",error);
        
    handleError(error);
    }
}

const handleChange = (e) => {
    setExpenseInfo({ description: "", category: "",amount:"" });
      const {name,value} = e.target;
      const copyExpenseInfo = {...expenseInfo};
      copyExpenseInfo[name] = value;

      setExpenseInfo(copyExpenseInfo);
  }

const addExpenses = async(e) => {
    e.preventDefault();
    
    const {description, category, amount} = expenseInfo;

    if(!description || !category || !amount){
        return handleError(" Description, Category and Amount are compulsory ");
    }
    
    try {
     const url = "http://localhost:3000/expenses/create";
      const response = await fetch(url,
            {
                method: "POST",
                body: JSON.stringify(expenseInfo),
                headers: {
                    "Content-Type":"application/json",
                    "Authorization":token
                }
            }
        );

       const result = await response.json();

       const {success, message, error} = result;

       if(success){
         handleSuccess(message);
         
         fetchExpenses();
        //  setTimeout(()=>{
        //     navigate('/expenses');
        //  },1000);
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




// loggedInUser localStorage.getItem('loggedInUser'),
const currUser = localStorage.getItem('loggedInUser');



const handleDelete = async(expenseId) => {
    // console.log(e);
    
    try {
    const url = "http://localhost:3000/expenses/delete";
    console.log(expenseId);
    
    const response = await fetch(url,
        {
        method: 'DELETE',
        body: JSON.stringify({expenseId:expenseId}),
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : token
        }
        }
    );
    
    const result = await response.json();
    const {success,message, error} = result;

    if(success){

        handleSuccess(message);
        fetchExpenses();
    }else if (error){
        handleError(error)
    }else if(!success){
        handleError(message);
    }
    
    } catch (error) {
    handleError(error);
    }

  
  
  }  


const checkToken = (token)=>{
    if(token){
        navigate('/expenses');
    }else{
        navigate('/login');
    }

}

//Pagination Portion

 const [currPage, setCurrPage] = useState(1);
 // Calculate the index range for the current page
 const [itemsPerPage, setItemsPerPage] = useState(10);
 const indexOfLastItem = currPage * itemsPerPage;
 const indexOfFirstItem = indexOfLastItem - itemsPerPage;

 const totalPages = Math.ceil(expenses?.length/10);  


  return (
    <currPageContext.Provider value={{currPage, setCurrPage}}>
    <>
    
    {token && (<>

        <h1>{loggedInUser}</h1>    
    <div id="container">
        
    <div id="expenseInput">
        <form id="expenseForm">
       
             <label htmlFor="description">Description</label> 
            <input id="decription" 
                   name="description" 
                   type="text" 
                   placeholder="Decription" 
                   onChange={handleChange}
                   value={expenseInfo.description}
                   required/>
            <label htmlFor="category">Select Expense Category</label> 
            <select id="category" 
                    name="category" 
                    onChange={handleChange}
                    value={expenseInfo.category}
                    required>
                <option value="">Category</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Electricity">Electricity</option>
                <option value="Rent">Rent</option>
                <option value="Food">Food</option>
                <option value="Others">Others</option>
            </select>
            <label htmlFor="amount"></label> 
            <input id="amount" 
                   name="amount" 
                   type="number" 
                   placeholder="Amount" 
                   onChange={handleChange}
                   value={expenseInfo.amount}
                   required/>
            <button onClick={addExpenses} id="addBtn">Add</button>
        </form>
    
    </div>

    {/* Search Bar Component Start */}
    <Searchbar expenses={expenses} setDisplayExpenses={setDisplayExpenses} />

    <div id="showExpenseData">
             <div className='chart-container'>
                <PieChart length={expenses?.length}/>
             </div>

            <table id= "expenseTable">
                <thead>
                <tr>
                    <th>Decription</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Delete/Update</th>
                </tr>
                { displayExpenses !== undefined &&  displayExpenses?.map((expense,index) => (
                   <tr key={expense._id+index}>
                        <th>{expense.description}</th>
                        <th>{expense.category}</th>
                        <th>{expense.amount}</th>
                        <th><button onClick={() => handleDelete(expense._id)}>Delete</button>
                           <button onClick={() => openModal(expense)}>Update</button>
                        </th>
                    </tr>
                   
                ))}
                </thead>
            </table>


    </div>
    <Pagination totalPages={totalPages} fetchExpenses={fetchExpenses}/>
    <h1>{currPage}</h1>
    <ToastContainer/>
    </div>
    <UpdateExpense open={isModalOpen} onClose={closeModal} expense={expense} fetchExpenses={fetchExpenses} />
    </>)}  

    </>
    </currPageContext.Provider>
  )
}

export default Expenses