import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './IdealTeam.module.css';
import config from '../../config/config';

function InputTeamPage() {
  const location = useLocation();
  const { method } = location.state;
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(Array(6).fill(null));
  const [showDropdown, setShowDropdown] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${config.apiBaseUrl}/api/pokemons`) 
    .then(response => {
      setPokemonList(response.data);
      console.log('Fetched Pokémon List:', response.data);
    })
    .catch(error => console.error('Error fetching Pokémon data:', error));
  }, []);

  useEffect(() => {
    async function fetchTeam() {
      setLoading(true);
      const start = performance.now()
      try {
        axios.post(`${config.apiBaseUrl}/api/generate-team`, { method })
        .then(response => {
          setSelectedPokemon(response.data);
          console.log('Fetched Pokémon List:', response.data);
        })
      } catch (error) {
        console.error('Error generating team:', error);
      }
      const end = performance.now();
      setDuration((end - start));
      setLoading(false);
    }

    fetchTeam();
  }, [method])

  const handleMenu = () => {
    navigate('/');

  };

  return (
    <div>
        {loading ? <h1>Generating team...</h1> : <h1>Ideal Team</h1>}
        {loading ? <div className={styles.latencyButton}>Runtime: ...</div> : <div className={styles.latencyButton}>Runtime: {duration.toFixed(2)} ms</div>}
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
