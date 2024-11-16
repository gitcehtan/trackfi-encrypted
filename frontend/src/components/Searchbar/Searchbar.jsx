import React, { useState } from 'react'
import "./Searchbar.css";
import { handleError } from '../../Utils';

const Searchbar = ({expenses, setDisplayExpenses}) => {

    const [searchInfo, setSearchInfo] = useState({category: "",startDate:"",endDate:"" }); // for expense creation

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update state only if the date conditions are met
        // here value means endDate Value
        if (name === "startDate" && searchInfo.endDate && value > searchInfo.endDate) {
            alert("Start Date cannot be later than End Date");
            return;
        }

        // here value means startDate Value

        if (name === "endDate" && searchInfo.startDate && value < searchInfo.startDate) {
            alert("End Date must be after Start Date");
            return;
        }

        // Update state directly if conditions are valid
        setSearchInfo({
            ...searchInfo,
            [name]: value
        });
      }

    const handleSearch = (e) => {
        e.preventDefault();
        const {category, startDate, endDate} = searchInfo;

        if( !startDate || !endDate){
            handleError("Category, Start Date, End Date cannot be empty");
            return;
        }

        
        console.log(searchInfo);
       
        let startTime = new Date(new Date(startDate).setHours(0,0,0,0));
        let endTime =  new Date(new Date(endDate).setHours(23,59,59,999));

     

        let result = expenses?.filter((expense)=> {

            let createdTime = new Date(expense.createdAt);
           


            console.log("Created Time "+createdTime+", start time: "+startTime+", end Time : "+endTime);
            // incase category is empty then show all OR check equality if category is present
            if(category=="" || category == expense.category){ 
                if(startDate === endDate){
                    if(startTime.getDate() === createdTime.getDate()){
                        return true;
                    }
                }
               else{
                if(startTime.getTime()<= createdTime.getTime()&& endTime.getTime() >= createdTime.getTime()){
                    return true;
                }
               }
            }

        }
         );
         console.log(result);
         setDisplayExpenses(result);
         
        
    }
    
  return (
    <div className='searchbar'>
    <form id="searchForm">
      <select id="category" 
              name="category" 
              onChange={handleChange}
              value={searchInfo.category}
              required>
          <option value="">Category</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Electricity">Electricity</option>
          <option value="Rent">Rent</option>
          <option value="Food">Food</option>
          <option value="Others">Others</option>
      </select>
      <label htmlFor="startDate">Start Date</label>
      <input id="startDate" 
             name="startDate" 
             type="date" 
             placeholder="Start Date" 
             onChange={handleChange}
             value={searchInfo.startDate}
             max={searchInfo.endDate || undefined} // Disable Dates after endDate
             required/>
      <label htmlFor="endDate">End Date</label>
      <input id="endDate" 
             name="endDate" 
             type="date" 
             placeholder="End Date" 
             onChange={handleChange}
             value={searchInfo.endDate}
             min={searchInfo.startDate || undefined} // Disable dates before startDate
             required/>
      <button id="searchBtn" onClick={handleSearch}>Search</button>
     </form>
    </div>
  )
}

export default Searchbar