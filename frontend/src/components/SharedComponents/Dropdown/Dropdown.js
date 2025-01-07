import React, { useState } from 'react';
import styles from './Dropdown.module.css';

const Dropdown = ({ options, selectedOption, onChange, isLoading }) => {
  const [filter, setFilter] = useState('');

  const handleFilterChange = (e) => {
    setFilter(e.target.value.toLowerCase());
  };

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(filter)
  );

  const enhancedFilteredOptions = selectedOption
   ? filteredOptions.concat(options.find(option => option.id === selectedOption)).filter((v, i, a) => a.indexOf(v) === i)
   : filteredOptions;

  return (
    <div className='dropdownContainer'>
      { isLoading ? (
        <p className={styles.loadingBox}>
          Backend is loading, please wait a minute and return to https://dsa-project-3-1.onrender.com/
        </p>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={filter}
            onChange={handleFilterChange}
            className="filterInput"
          />
          <select
            value={selectedOption !== null ? selectedOption : ''}
            onChange={e => onChange(Number(e.target.value))}
            size={enhancedFilteredOptions.length > 1 ? enhancedFilteredOptions.length : 2}
            className="dropdownSelect"
            defaultValue=""
          >
            <option value="" disabled>Select Pokémon</option>
            {enhancedFilteredOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.id} - {option.name}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default Dropdown;

