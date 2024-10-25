import { useState, useEffect } from 'react';

function RecordDetails({ record, table, setSelectedRecord}) {
  const [associatedData, setAssociatedData] = useState({ parentDataResults: [], childDataResults: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecord, setEditedRecord] = useState(record);
  const [recordx, setRecord] = useState(record);
  const url =  process.env.REACT_APP_API_URL;
  useEffect(() => {
    async function fetchAssociatedData() {
      if (recordx) {
       
        const lastIdField = Object.keys(recordx).reverse().find(key => key.endsWith("id"));
        const id = recordx[lastIdField];
  
        const response = await fetch(`${url}/getrelateddata?table=${table}&id=${id}`);
        const data = await response.json();
        setAssociatedData(data);
      }
    }
  
    fetchAssociatedData();
  }, [recordx, table]);
  

 

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (confirmDelete) {
      try {
        const [_, id] = Object.entries(recordx)[0];
        await fetch(`${url}/deleteRecord?resource=${table}&id=${id}`, { method: 'DELETE' });
        alert('Record deleted successfully');
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  const handleSave = async () => {
   
    try {
      const [_, id] = Object.entries(recordx)[0];
      const response = await fetch(`${url}/editRecord?resource=${table}&id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({data: editedRecord }),
      });
      console.log(JSON.stringify(editedRecord))
      const message = await response.json()
      alert(message.error || "success!");
      setIsEditing(false); 
      setRecord(editedRecord); 
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRecord(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ height: "10px" }}></div>
      <button className='btn btn-secondary' onClick={() => setSelectedRecord(null)}>{"Back to table"}</button>
      <div style={{ height: "20px" }}></div>
      <div>
        <h3>Selected Record:</h3>
        <table className="table">
          <thead>
            <tr>
              {Object.keys(recordx).map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {Object.keys(recordx).map((column, index) => (
                <td key={index}>
                  {isEditing ? (
                    <input
                      type="text"
                      name={column}
                      value={editedRecord[column] || ''}
                      placeholder={record[column]}
                      onChange={handleChange}
                    />
                  ) : (
                    recordx[column]
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: "10px" }}>
          {isEditing ? (
            <>
              <button className="btn btn-success" onClick={handleSave}>Save</button>
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)} style={{ marginLeft: "10px" }}>Cancel</button>
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={handleEdit}>Edit</button>
              <button className="btn btn-danger" style={{ marginLeft: "10px" }} onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      </div>
      <div style={{ height: "20px" }}></div>
      <div>
        <h3>Associated Data:</h3>
        <div style={{ height: "20px" }}></div>

        <h4>Parents:</h4>
{Array.isArray(associatedData.parentDataResults) && associatedData.parentDataResults.length > 0 ? (
    <table className="table">
        <thead>
            <tr>
                {Object.keys(associatedData.parentDataResults[0][0]).map((column) => (
                    <th key={column}>{column}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {associatedData.parentDataResults.flat().map((item, index) => ( 
                <tr key={index}>
                    {Object.keys(item).map((column) => (
                        <td key={column}>{item[column]}</td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
) : (
    <p>No parent data found</p>
)}

<h4>Children:</h4>
{Array.isArray(associatedData.childDataResults) && associatedData.childDataResults.length > 0 ? (
    <table className="table">
        <thead>
            <tr>
                {Object.keys(associatedData.childDataResults[0][0]).map((column) => (
                    <th key={column}>{column}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {associatedData.childDataResults.flat().map((item, index) => (
                <tr key={index}>
                    {Object.keys(item).map((column) => (
                      
                        <td key={column}>{item[column]}</td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
) : (
    <p>No child data found</p>
)}
      </div>
    </div>
  );
}

export default RecordDetails;
