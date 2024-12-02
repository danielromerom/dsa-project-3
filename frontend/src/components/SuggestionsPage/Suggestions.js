import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Suggestions.module.css';

const Suggestions = () => {
  const location = useLocation();
  const selectedPokemon = location.state?.selectedPokemon || [];
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupPokemon, setPopupPokemon] = useState(null);
  const [isShiny, setIsShiny] = useState(false);
  const [types, setTypes] = useState([]);
  const [isAbilityPopupVisible, setIsAbilityPopupVisible] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/api/types')
      .then(response => {
        setTypes(response.data);
      })
        .catch(error => console.error('Error fetching types:', error));
  }, []);

  const handlePokemonClick = (pokemon) => {
    if (pokemon) {
      setPopupPokemon(pokemon);
      setIsShiny(false);
      setIsPopupVisible(true);
    }
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setPopupPokemon(null);
  };

  const toggleShiny = () => { 
    setIsShiny(!isShiny); 
  };

  const capitalizeFirstLetter = (string) => { 
    return string.charAt(0).toUpperCase() + string.slice(1); 
  };

  const getTypeName = (typeId) => {
    const type = types.find(t => t.id === typeId);
    return type ? type.type_name : '';
  };

  const checkHiddenAbility = (hiddenAbility) => {
    if (hiddenAbility) {
      return capitalizeFirstLetter(hiddenAbility)
    } else {
      return "N/A"
    }
  }

  const convertWeightToLbs = (weightInHectograms) => {
    const weightInGrams = parseInt(weightInHectograms, 10) * 100;
    const weightInPounds = weightInGrams * 0.00220462;
    return weightInPounds.toFixed(1);
  };
  

  const generationMap = {
    'i': 'Kalos',
    'ii': 'Johto',
    'iii': 'Hoenn',
    'iv': 'Sinnoh',
    'v': 'Unova',
    'vi': 'Kalos',
    'vii': 'Alola',
    'viii': 'Galar',
    'ix': 'Paldea',
  };
  
  const convertGeneration = (romanNumeral) => {
    return generationMap[romanNumeral.toLowerCase()] || 'Unknown Generation';
  };
  
  const handleAbilityClick = (description, bool) => {
    if (description) {
      setIsHidden(bool)
      setIsAbilityPopupVisible(true);
    }
  }

  const handleAbilityPopupClose = () => {
    setIsAbilityPopupVisible(false);
  }

  const handleMenu = () => {
    navigate('/');

  };

  return (
    <div>
      <h1>Suggestions</h1>
      <div className= {styles.pokemonContainer}>
        <div className= {styles.pokemonRows}>
          {selectedPokemon.slice(0, 3).map((pokemon, index) => (
            <div
              key={index}
              className={styles.pokemonCircle}
              onClick={() => handlePokemonClick(pokemon)}
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
              onClick={() => handlePokemonClick(pokemon)}
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

      {isPopupVisible && (
        <div className={styles.popupOverlay} onClick={handleClosePopup}>
          <div className={styles.popupContent} onClick={e => e.stopPropagation()}>
            <h2>{capitalizeFirstLetter(popupPokemon?.name)}</h2>
            <div
              key={popupPokemon.index}
              className={styles.pokemonCircle}
            >
              <img 
              src={isShiny ? popupPokemon?.shiny_front_sprite : popupPokemon?.front_sprite} 
              alt={popupPokemon?.name} 
              className={styles.pokemonImage}
              />
            </div>
            <div className={styles.idBox}>
              <p>{popupPokemon?.id}</p>
            </div>
            <button
              className={styles.shinyButton}
              onClick={toggleShiny}
            >
              <img 
                src="/images/shiny_sparkles.png"
                alt="shiny button"
                className={styles.shinyImage}
              />
            </button>
            <div
              className={styles.typeBox1} 
              style={{ backgroundColor: `VAR(--${getTypeName(popupPokemon?.type1_id)})` }}
            > 
              {capitalizeFirstLetter(getTypeName(popupPokemon?.type1_id))} 
            </div> 
            {popupPokemon?.type2_id && ( 
              <div 
                className={styles.typeBox2} 
                style={{ backgroundColor: `VAR(--${getTypeName(popupPokemon?.type2_id)})` }}
              > 
                {capitalizeFirstLetter(getTypeName(popupPokemon?.type2_id))}
              </div>
            )}

            <div className={styles.statsBox}>
              <p className={styles.abilityTitle}>Ability</p>
              <button 
                className={styles.abilityName}
                onClick={() => (handleAbilityClick(popupPokemon?.ability_desc, false))}
              >
                {capitalizeFirstLetter(popupPokemon?.ability)}
              </button>
        
              <p className={styles.hiddenAbilityTitle}>Hidden Ability</p>
              <button
                className={styles.hiddenAbilityName}
                onClick={() => (handleAbilityClick(popupPokemon?.hidden_ability_desc, true))}
              >
                {checkHiddenAbility(popupPokemon?.hidden_ability)}
              </button>
              
              <p className={styles.generationTitle}>Region</p>
              <p className={styles.generationName}>{convertGeneration(popupPokemon?.generation)}</p>
              <p className={styles.weightTitle}>Weight</p>
              <p className={styles.weightName}>{convertWeightToLbs(popupPokemon?.weight)} lbs</p>
            </div>

            <div className= {styles.learnContainer}>
              <h1 className={styles.learnTitle}>Can Learn:</h1>
        
              <div className= {styles.learnBox}>

              </div>
            </div>
          </div>
        </div>
      )}

      {isAbilityPopupVisible && (
        <div className={styles.abilityPopupBG} onClick={handleAbilityPopupClose}>
          <div className={styles.abilityPopup} onClick={e => e.stopPropagation()}>
            <p className={styles.abilityTitle}>{capitalizeFirstLetter(isHidden ? popupPokemon?.hidden_ability : popupPokemon?.ability)}</p>
            <p className={styles.abilityDescription}>{isHidden ? popupPokemon?.hidden_ability_desc : popupPokemon?.ability_desc}</p>
          </div>
        </div>
      )}

      <div className= {styles.weaknessesContainer}>
        <h1 className={styles.weaknessesTitle}>Weaknesses</h1>
        <div className= {styles.weaknessesBox}>

        </div>
      </div>
      
      <div className= {styles.movesContainer}>
        <h1 className={styles.movesTitle}>Move Suggestions</h1>
        
        <div className= {styles.movesBox}>

        </div>
      </div>
      
      <div className= {styles.pokeSuggContainer}>
      <h1 className={styles.pokeSuggTitle}>Pokemon Suggestions</h1>
      <div className= {styles.pokeSuggBox}>

        </div>
      </div>

      <div className={styles.menuButtonContainer}> 
          <button className={styles.menuButton}onClick={handleMenu}>Back to Menu</button> 
      </div>
    </div>
  );
};

export default Suggestions;