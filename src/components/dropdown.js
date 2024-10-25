import React, { useEffect } from 'react';

function Dropdown({ options, selected, onSelect }) {

   
    return (
        <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {selected}
            </button>
            <ul className="dropdown-menu">
                {options.map((option, index) => (
                    <li key={index}>
                        <a className="dropdown-item" onClick={() => onSelect(option)}>{option}</a> 
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dropdown;
