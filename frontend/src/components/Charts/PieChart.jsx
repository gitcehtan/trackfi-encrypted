import {Pie} from "react-chartjs-2";
import {Chart as ChartJS, Legend, ArcElement, Tooltip} from "chart.js";
import { useEffect, useState } from "react";
import { handleError } from "../../Utils";

ChartJS.register(Tooltip, Legend, ArcElement);

 

const PieChart = ({length}) => {

  let token = localStorage.getItem('token');
  let LoggedinUser = localStorage.getItem('loggedInUser');
  
  const [aggregateSum, setAggregateSum ] = useState([{_id:"", count:""}]);
  useEffect(()=>{
      totalAmounts();
  },[length]);
  
    const totalAmounts = async() => {
        try {
            const url  = "http://localhost:3000/aggregate/groupsum";
            const headers = {
                headers: {
                "Authorization" : token,
                "Content-Type": "application/json"
                }
            }
                const response = await fetch(url, headers);
                const result = await response.json();
                setAggregateSum(result);
                
                // console.log("Group Expenses ",result); // [{_id: "FOOD", count: 1220}] 
                
            
            } catch (error) {
                console.log("error",error);
                
            handleError(error);
            }
    }


    const separateKeysAndValues = (array) => {
        const ids =   array?.map(item => item._id);
        const counts =  array?.map(item => item.count);
        return { ids, counts };
      }  // to seprqate [{_id:"Food",count:344}] id and count in new array
      // ${LoggedinUser} Your Expenses Depicted Below
      
    
    // Define the desired order of _id values
    const desiredOrder = ["Food", "Entertainment", "Electricity", "Rent", "Others"];

    // Sort the aggregateSum array based on the desired order
    aggregateSum.sort((a, b) => {
      return desiredOrder.indexOf(a._id) - desiredOrder.indexOf(b._id);
    });
      
    const pieData  = separateKeysAndValues(aggregateSum);
    
    useEffect(()=>{
    console.log("Pie data "+pieData.ids);
    
    },[])

    const categoryColorMap = {
      "Entertainment": "#FF6384",
      "Electricity": "#36A2EB",
      "Rent": "#FFCE56",
      "Food": "#4BC0C0",
      "Others": "#9966FF",
      // Add more categories and their corresponding colors as needed
    };

    const backgroundColors = pieData.ids.map(category => categoryColorMap[category] || "#CCCCCC"); // Default color if not found
    

   const data = {labels: pieData.ids,
        datasets: [{
          label: `Amount Spent`,
          data: pieData.counts,
          backgroundColor: backgroundColors,
          hoverOffset: 4
        }]
      };
  const options = {
    responsive: true,
    maintainAspectRatio: true,
   
  }

  return (
    <>
       <Pie options={options} data={data} />
    </>
  )
}

export default PieChart;