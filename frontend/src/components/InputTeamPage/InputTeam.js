import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../SharedComponents/Dropdown/Dropdown.js';
import './InputTeam.css';

function InputTeamPage() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(Array(6).fill(null));
  const [showDropdown, setShowDropdown] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/api/pokemons') 
    .then(response => {
      setPokemonList(response.data);
      console.log('Fetched Pokémon List:', response.data);
    })
    .catch(error => console.error('Error fetching Pokémon data:', error));
  }, []);

  const handlePokemonChange = (index, selectedId) => {
    console.log('Selected ID:', selectedId); 
    const updatedSelectedPokemon = [...selectedPokemon]; 
    console.log('Selected Pokémon:', updatedSelectedPokemon); // Debugging log 
    const selectedPokemonData = pokemonList.find(pokemon => pokemon.id === String(selectedId)); 
    console.log('Selected Pokémon Data:', selectedPokemonData); // Debugging log 
    updatedSelectedPokemon[index] = selectedPokemonData; 
    console.log('Updated Selected Pokémon:', updatedSelectedPokemon); // Debugging log 
    setSelectedPokemon(updatedSelectedPokemon); 
    setShowDropdown(-1); // Close the dropdown after selection
  };
  
  const toggleDropdown = (index) => { 
    console.log('Toggling dropdown for index:', index); 
    setShowDropdown(prevIndex => (prevIndex === index ? -1 : index)); // Toggle or close 
  };

  const handleSubmit = () => {
    const isPokemonSelected = selectedPokemon.some(pokemon => pokemon !== null);
    if (isPokemonSelected) {
      navigate('/suggestions', { state: { selectedPokemon } });
    } else {
      alert('Please select at least one Pokemon!');
    }
  };

  // axios.post('http://localhost:3000/api/three-lowest-stats', { selectedPokemon: updatedSelectedPokemon }) 
  //   .then(response => console.log('Three Lowest Stats:', response.data)) 
  //   .catch(error => console.error('Error fetching stats:', error)); 
  
  // axios.post('http://localhost:3000/api/single-lowest-stat', { selectedPokemon: updatedSelectedPokemon }) 
  //   .then(response => console.log('Single Lowest Stat:', response.data)) 
  //   .catch(error => console.error('Error fetching stats:', error)); 
  
  // axios.post('http://localhost:3000/api/lowest-pokemon-from-stat', { stat: 'attack' }) 
  //   .then(response => console.log('Lowest Pokémon by Attack Stat:', response.data)) 
  //   .catch(error => console.error('Error fetching stats:', error)); 
  
  // axios.post('http://localhost:3000/api/better-pokemon-type-stat', { lowestPokemon: updatedSelectedPokemon[0], stat: 'attack' }) 
  //   .then(response => console.log('Better Pokémon for Attack:', response.data)) 
  //   .catch(error => console.error('Error fetching stats:', error)); 
  
  // axios.post('http://localhost:3000/api/can-evolve', { pokemon: updatedSelectedPokemon[0] }) 
  //   .then(response => console.log('Can Evolve:', response.data)) 
  //   .catch(error => console.error('Error fetching stats:', error)); 
  
  // axios.post('http://localhost:3000/api/type-weaknesses', { team: updatedSelectedPokemon }) 
  //   .then(response => console.log('Type Weaknesses:', response.data)) 
  //   .catch(error => console.error('Error fetching stats:', error));

  return (
    <div>
      <h1>Input Your Team</h1>
      <div className="pokemon-selection-container">
        <div className="pokemon-rows"> 
          {selectedPokemon.slice(0, 3).map((pokemon, index) => ( 
            <div 
              key={index} 
              className={`pokemon-circle ${showDropdown === index ? 'show-dropdown' : ''}`} 
              onClick={() => toggleDropdown(index)} 
            > 
              <img 
                src={pokemon ? pokemon.front_sprite : ''} 
                alt={pokemon ? pokemon.name : ''} 
                className="pokemon-image" 
              /> 
              {showDropdown === index && ( 
                <div 
                  className="dropdown-container" 
                  onClick={e => e.stopPropagation()} // Prevent event propagation 
                > 
                  <Dropdown 
                    options={pokemonList} 
                    selectedOption={pokemon ? pokemon.id : ''} 
                    onChange={selectedId => handlePokemonChange(index, selectedId)} 
                  /> 
                </div> 
              )} 
            </div> 
          ))} 
        </div>
        <div className="pokemon-rows"> 
          {selectedPokemon.slice(3, 6).map((pokemon, index) => ( 
            <div 
              key={index + 3} 
              className={`pokemon-circle-2 ${showDropdown === index + 3 ? 'show-dropdown' : ''}`} 
              onClick={() => toggleDropdown(index + 3)} 
            > 
              <img 
                src={pokemon ? pokemon.front_sprite : ''} 
                alt={pokemon ? pokemon.name : ''} 
                className="pokemon-image" 
              /> 
              {showDropdown === index + 3 && ( 
                <div 
                  className="dropdown-container" 
                  onClick={e => e.stopPropagation()} // Prevent event propagation 
                > 
                  <Dropdown 
                    options={pokemonList} 
                    selectedOption={pokemon ? pokemon.id : ''} 
                    onChange={selectedId => handlePokemonChange(index + 3, selectedId)} 
                  /> 
                </div> 
              )} 
            </div> 
          ))} 
        </div>
        <div className="submit-button-container"> 
          <button onClick={handleSubmit}>Submit</button> 
        </div>
      </div>
    </div>
  );
}
      
export default InputTeamPage;
