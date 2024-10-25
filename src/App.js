import './App.css';
import Dropdown from './components/dropdown';
import Pagination from './components/pagination';
import Table from './components/table';
import { useState, useEffect} from "react";
import { TableProvider } from './context/tablecontext';
import AddRecordForm from './components/addrecordform';
import RecordDetails from './components/recorddetails';
function App() {
  const [selectedTable, setSelectedTable] = useState(process.env.REACT_APP_TABLE_OPTIONS.split(',')[0]);
  const [selectedTableSort, setSelectedTableSort] = useState("");
  const tableOptions = process.env.REACT_APP_TABLE_OPTIONS.split(','); 
  const [sortOptions, setSortOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("table");
  const [selectedRecord, setSelectedRecord] = useState(null);




  useEffect(() => {
    setSelectedRecord(null);
    setSearchTerm("");
    
    
  }, [selectedTable]);


  
  const handleColumnsFetched = (columns) => {
    setSortOptions(columns); 
    
    if (!selectedTableSort && columns.length > 0) {
      setSelectedTableSort(columns[0]); 
    }
  };

 

  const renderView = () => {

    if (selectedRecord) {
      console.log(selectedRecord)
      return (<RecordDetails record={selectedRecord} table={selectedTable} setSelectedRecord={setSelectedRecord}/>);
    }
    switch (view) {
      case "table":
        return (
          <Table 
            selectedTable={selectedTable} 
            onColumnsFetched={handleColumnsFetched} 
            searchTerm={searchTerm} 
            selectedTableSort={selectedTableSort}
            setSelectedRecord={setSelectedRecord}
            setSelectedTableSort={setSelectedTableSort}
          />
        );
      case "addRecord":
        return <AddRecordForm selectedTable={selectedTable} setView={setView} />;
      
      default:
        return null;
    }
  };


  return (
    <TableProvider>
      <div className="App">
        <h1 style={{margin:"auto"}}>Crud interface</h1>
       
        <div className="main-top">
          <div className="main-top-flex">
            <div className="main-top-flex-left">
              <button type="button" className="btn btn-success" onClick={() => setView("addRecord")}>Add record</button>
              <Dropdown options={tableOptions} selected={selectedTable} onSelect={setSelectedTable} />
            </div>
            <input
              placeholder="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Dropdown options={sortOptions} selected={selectedTableSort} onSelect={setSelectedTableSort} selectedTable={selectedTable}/>
            
          </div>
        </div>

        <div className="main-middle">
        {renderView()}
</div>
        <div className="main-bottom">

         { !selectedRecord && <Pagination />}

        </div>
      </div>
    </TableProvider>
  );
}

export default App;
