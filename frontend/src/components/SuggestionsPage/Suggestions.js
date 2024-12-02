import React from "react";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './Suggestions.module.css';

const Suggestions = () => {
  const location = useLocation();
  const selectedPokemon = location.state?.selectedPokemon || [];

  return (
    <div>
      <h1>Suggestions</h1>
      <div className= {styles.pokemonContainer}>
        <div className= {styles.pokemonRows}>
          {selectedPokemon.slice(0, 3).map((pokemon, index) => (
            <div
              key={index}
              className={styles.pokemonCircle}
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
              className={styles.pokemonCircle2}
            >
              <img
                src={pokemon ? pokemon.front_sprite : ''}
                alt={pokemon ? pokemon.name : ''}
                className={styles.pokemonImage}
              />
            </div>
          ))}
        </div>
      </div>

      <div className= {styles.weaknessesContainer}>
        
      </div>
      
      <div className= {styles.movesContainer}>
        
      </div>
      
      <div className= {styles.pokeSuggContainer}>
        
      </div>

      <div className={styles.menuButtonContainer}> 
          <button>Back to Menu</button> 
      </div>
    </div>
  );
};

export default Suggestions;