import React from "react";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Suggestions.css';

const Suggestions = () => {
  const location = useLocation();
  const selectedPokemon = location.state?.selectedPokemon || [];

  return (
    <div>
      <h1>Suggestions</h1>
      <div className="pokemon-container">
        <div className="pokemon-rows first-row">
          {selectedPokemon.slice(0, 3).map((pokemon, index) => (
            <div
              key={index}
              className="pokemon-circle"
            >
              <img
                src={pokemon ? pokemon.front_sprite : ''}
                alt={pokemon ? pokemon.name : ''}
                className="pokemon-image"
              />
            </div>
          ))}
        </div>
        <div className="pokemon-rows second-row">
          {selectedPokemon.slice(3, 6).map((pokemon, index) => (
            <div
              key={index + 3}
              className="pokemon-circle"
            >
              <img
                src={pokemon ? pokemon.front_sprite : ''}
                alt={pokemon ? pokemon.name : ''}
                className="pokemon-image"
              />
            </div>
          ))}
        </div>
      </div>
      <ul>
        {selectedPokemon.map((pokemon, index) => (
          pokemon && (
            <li key={index}>
              <img src={pokemon.front_sprite} alt={pokemon.name} />
              <span>{pokemon.name}</span>
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

export default Suggestions;