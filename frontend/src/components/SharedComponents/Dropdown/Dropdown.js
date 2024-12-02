import React from 'react';
import './Dropdown.module.css';

const Dropdown = ({ options, selectedOption, onChange }) => {
  return (
    <select
      value={selectedOption || ''}
      onChange={e => onChange(Number(e.target.value))}
      size={options.length}
    >
      <option value="" disabled>Select Pokémon</option>
      {options.map(option => (
        <option key={option.id} value={option.id}>
          {option.id} - {option.name}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
