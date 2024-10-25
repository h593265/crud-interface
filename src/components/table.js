import { useEffect, useState, useContext } from "react";
import { TableContext } from '../context/tablecontext';
import '../App.css';

function Table({ selectedTable, onColumnsFetched, searchTerm, selectedTableSort, setSelectedRecord, setSelectedTableSort}) {
    const { currentPage, recordsPerPage, setTotalRecords } = useContext(TableContext);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [columnTypes, setColumnTypes] = useState([]);
    const [loading, setLoading] = useState(true);  
    const url =  process.env.REACT_APP_API_URL;
    useEffect(() => {
        async function fetchData() {
            setLoading(true);  
            try {
                const offset = (currentPage - 1) * recordsPerPage;

                const queryParams = new URLSearchParams({
                    resource: encodeURIComponent(selectedTable),
                    limit: recordsPerPage,
                    offset: offset,
                    search: searchTerm,
                    column: selectedTableSort
                });

                const result = await fetch(`${url}/gettabledata?${queryParams}`, { method: "GET" });
                const jsondata = await result.json();

                setTotalRecords(jsondata.totalRecords);
                setData(jsondata.data);
                setColumnTypes(jsondata.columnTypes);
                
                if (jsondata.data.length > 0) {
                    const fetchedColumns = Object.keys(jsondata.data[0]);
                    setColumns(fetchedColumns);
                    
                } else {
                    setColumns([]); 
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);  
            }
        }

        fetchData();
    }, [selectedTable, currentPage, recordsPerPage, searchTerm, setTotalRecords]);

  

    useEffect (() => {
        if (columns.length > 0 && !searchTerm) {
       onColumnsFetched(columns)
        setSelectedTableSort(columns[0]); }
    }, [columns]) 

 

    return (
        <div className="table-wrapper">
            {loading ? (  
                <p>Loading...</p>
            ) : data ? (
                <table className="table">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index} onClick={() => setSelectedRecord(item)}>
                                {columns.map((column) => (
                                    <td key={column}>{item[column]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No data available</p>  
            )}
        </div>
    );
}

export default Table;
