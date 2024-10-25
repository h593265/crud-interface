import React, { createContext, useState } from 'react';


export const TableContext = createContext();


export const TableProvider = ({ children }) => {
    const [selectedTable, setSelectedTable] = useState(process.env.REACT_APP_TABLE_OPTIONS.split(',')[0]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(15); 

    const value = {
        selectedTable,
        setSelectedTable,
        totalRecords,
        setTotalRecords,
        currentPage,
        setCurrentPage,
        recordsPerPage
    };

    return (
        <TableContext.Provider value={value}>
            {children}
        </TableContext.Provider>
    );
};
