import React, { useEffect, useState } from 'react'
import './Modal.css';
import { handleError, handleSuccess } from '../../Utils';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UpdateModal = ({open, onClose,expense, fetchExpenses}) => {
    const expenseId = expense._id;
    let token = localStorage.getItem('token');
    
    
    
    const [updateExpenseInfo, setUpdateExpenseInfo] = useState({ description: "", category: "" ,amount:""});
    const navigate = useNavigate();
    
    useEffect(() => {
        setUpdateExpenseInfo({
          description: expense.description,
          category: expense.category,
          amount: expense.amount
        });
        console.log("initial values "+expense.description);
    }, [expense]); // The empty array makes this run only once, when the component mounts
    

    const handleUpdateChange = (e) => {
        
        
        // setUpdateExpenseInfo({ description: expense.description, category: expense.category ,amount:expense.amount});
        const {name,value} = e.target;
        const copyUpdateExpenseInfo = {...updateExpenseInfo};
        copyUpdateExpenseInfo[name] = value;
    
        setUpdateExpenseInfo(copyUpdateExpenseInfo);
    }
    
    const updateExpense = async(e) => {
        e.preventDefault();
        
        const {description, category, amount} = updateExpenseInfo;

    if(!description || !category || !amount){
        return handleError(" Description, Category and Amount are compulsory ");
    }
    
    try {
     const url = "http://localhost:3000/expenses/update";
      const response = await fetch(url,
            {
                method: "POST",
                body: JSON.stringify({
                    expenseId,
                    description,
                    category,
                    amount
                }),
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
         console.log("Update success ");
         setTimeout(()=>{
             navigate('/expenses');
             onClose();
             fetchExpenses();
            },5000);
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
        { open === true && (<div id="myModal" className="modal">

       
        <div className="modal-content">
        <span onClick={onClose} className="close">&times;</span>
        
        <form id="updateExpenseForm">
            <input id="update-decription" 
                   name="description" 
                   type="text" 
                   placeholder="Decription" 
                   onChange={handleUpdateChange}
                   value={updateExpenseInfo.description}
                   required/>
            <select id="update-category" 
                    name="category" 
                    onChange={handleUpdateChange}
                    value={updateExpenseInfo.category}
                    required>
                <option value="">Category</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Electricity">Electricity</option>
                <option value="Rent">Rent</option>
                <option value="Food">Food</option>
                <option value="Others">Others</option>
            </select>
            <input id="update-amount" 
                   name="amount" 
                   type="number" 
                   placeholder="Amount" 
                   onChange={handleUpdateChange}
                   value={updateExpenseInfo.amount}
                   required/>
            <button onClick={updateExpense} className="update-submit">Update</button>
        </form>
        </div>
         {/* <ToastContainer/>        */}
        </div>)
       }
    </>
  )
}

export default UpdateModal