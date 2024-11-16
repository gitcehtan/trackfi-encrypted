import React, { useContext, useEffect, useState } from 'react';
import css from "./Pagination.module.css";
import {currPageContext} from "../Expenses/Expenses.jsx";

const Pagination = ({totalPages, fetchExpenses}) => {
  const [pageNumber, setPageNumber] = useState();
//   totalPages=26;
 
  const {currPage, setCurrPage} = useContext(currPageContext);

  const handlePagination = (page) => {
  
        setCurrPage(page);
        
  }

  const handlePrev = (e) => {
    e.preventDefault();
    console.log("Prev tn clicked ");
    
    if(currPage-1 > 0)
        setCurrPage(currPage-1);
}

const handleNext = (e) => {
    e.preventDefault();
    console.log("Next tn clicked ");
    if(currPage+1 <= totalPages)
       setCurrPage(currPage+1);
  }

    
  useEffect(()=>{
      console.log(currPage);
      fetchExpenses();

  },[currPage]);

  return (
    <div className={css.pagination}>
    <button className={css.prevBtn}
            onClick={handlePrev}
            disabled={currPage === 1}
    >&lt; <br/> Previous</button>
    <div className={css.pageBtns}>
        {Array.from({length: totalPages}, (_, index)=> index+1)?.map(page => (
            <button
            key={Math.random(100)+page}
            className={css.pageBtn}
            onClick={()=> {handlePagination(page)}}
            >{page}</button>
        ))}
    </div>
    <button className={css.nextBtn}
            onClick={handleNext}
            disabled={currPage === totalPages}
    >&gt; <br/> Next</button>
    </div>
  )
}

export default Pagination;