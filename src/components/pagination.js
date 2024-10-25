import { useEffect, useState, useContext } from 'react';
import { TableContext } from '../context/tablecontext';
import '../App.css';

function Pagination() {
    const { totalRecords, currentPage, setCurrentPage, recordsPerPage } = useContext(TableContext);
    const [paginationNumbers, setPaginationNumbers] = useState([]);
  
    useEffect(() => {
        const totalPages = Math.ceil(totalRecords / recordsPerPage);
        const numbers = [];
        for (let i = 1; i <= totalPages; i++) {
            numbers.push(i);
        }
        setPaginationNumbers(numbers);
    }, [totalRecords, recordsPerPage]);
  
    return (
        <div className="pagination-wrapper">
            {paginationNumbers.map((pageNumber) => (
                <button 
                    
                    key={pageNumber} 
                    onClick={() => setCurrentPage(pageNumber)} 
                    className={currentPage === pageNumber ? 'btn btn-dark' : 'btn btn-primary'}
                >
                    {pageNumber}
                </button>
            ))}
        </div>
    );
}

export default Pagination;
