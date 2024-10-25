import '../App.css'
import { useState, useEffect } from 'react';
function AddRecordForm({ selectedTable, setView}) {
    const [columndata, setColumns] = useState([]);
    const [formData, setFormData] = useState({});
    const url =  process.env.REACT_APP_API_URL;
    useEffect(() => {
        async function fetchColumns() {
            if (selectedTable) {
                const response = await fetch(`${url}/gettablecolumns?resource=${selectedTable}`);
                const data = await response.json();
                
                
                if (data.columns) {
                    
                    const filteredColumns = data.columns.filter(col => {
                        const isPrimaryKey = col.column_name === `${selectedTable}id`; 
                        return !isPrimaryKey; 
                    });
                    console.log(filteredColumns)
                    
                    
                    const initialData = {};
                    filteredColumns.forEach(col => {
                        initialData[col.column_name] = ''; 
                    });
                    
                    setColumns(filteredColumns);
                    setFormData(initialData);
                    
                }
               
            }
        }
    
        fetchColumns();
      
      
        
    }, [selectedTable]);
    

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        
        
    
        const payload = {
            resource: selectedTable,
            data: formData,
            columndata, columndata
        };
    
        const response = await fetch(`${url}/addrecord`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        console.log(payload)
    
        if (response.ok) {
            const result = await response.json();
            console.log('Record added successfully:', result);
        } else {
            const errorData = await response.json();
            console.error('Error adding record:', errorData.error);
        }
    };
    

    return (
        <div className='form-wrapper'><form onSubmit={handleSubmit}>
        {columndata.map((col) => (
            <div key={col.column_name}>
                <label>{col.column_name}:</label>
                <input
                    type={
                        col.column_name.includes("date")
                            ? 'date'
                            : col.data_type === "numeric" ||  col.data_type === "integer"
                            ? 'number'
                            : 'text'
                    }
                    name={col.column_name}
                    value={formData[col.column_name] || ''}
                    onChange={handleChange}
                />
            </div>
        ))}
        <div style={{display:"flex", gap:"30px"}}>
            <button type="submit" className='btn btn-success' style={{maxWidth:"110px"}}>Add Record</button>
            <button type="cancel" className='btn btn-danger' style={{minWidth:"110px"}} onClick={() => setView("table")}>Cancel</button>
        </div>
    </form> </div>
    
    );
}

export default AddRecordForm;
