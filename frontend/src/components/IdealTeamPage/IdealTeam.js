import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './IdealTeam.module.css';

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

  const handleMenu = () => {
    navigate('/');

  };

  return (
    <div>
      <h1>Ideal Team</h1>
      <div className={styles.latencyButton}>Runtime: 0ms</div>
      <div className={styles.pokemonSelectionContainer}>
        <div className={styles.pokemonRows}> 
          {selectedPokemon.slice(0, 3).map((pokemon, index) => ( 
            <div 
              key={index} 
              className={`${styles.pokemonCircle1} ${showDropdown === index ? styles.showDropdown : ''}`} 
            > 
              <img 
                src={pokemon ? pokemon.front_sprite : ''} 
                alt={pokemon ? pokemon.name : ''} 
                className={styles.pokemonImage}
              /> 
            </div> 
          ))} 
        </div>
        <div className={styles.pokemonRows}> 
          {selectedPokemon.slice(3, 6).map((pokemon, index) => ( 
            <div 
              key={index + 3} 
              className={`${styles.pokemonCircle2} ${showDropdown === index + 3 ? styles.showDropdown : ''}`} 
            > 
              <img 
                src={pokemon ? pokemon.front_sprite : ''} 
                alt={pokemon ? pokemon.name : ''} 
                className={styles.pokemonImage} 
              /> 
            </div> 
          ))} 
        </div>
        <div className={styles.submitButtonContainer}> 
          <button onClick={handleMenu}>Back to Menu</button> 
        </div>
      </div>
    </div>
  );
}
      
export default InputTeamPage;
