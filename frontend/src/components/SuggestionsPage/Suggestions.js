import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Suggestions.module.css';
import config from '../../config/config.js';

const Suggestions = () => {
  const location = useLocation();
  const selectedPokemon = location.state?.selectedPokemon || [];
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupPokemon, setPopupPokemon] = useState(null);
  const [isShiny, setIsShiny] = useState(false);
  const [types, setTypes] = useState([]);
  const [typeEffectives, setTypeEffectives] = useState([]);
  const [moves, setMoves] = useState([]);
  const [stats, setStats] = useState([]);
  const [pokemonMoves, setPokemonMoves] = useState([]);
  const [typeWeaknesses, setTypeWeaknesses] = useState([]);
  const [evolvablePokemon, setEvolvablePokemon] = useState([]);
  const [isAbilityPopupVisible, setIsAbilityPopupVisible] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [statWeaknesses, setStatWeaknesses] = useState([]);
  const [effectiveMoves, setEffectiveMoves] = useState([]);
  const [bestSuggestions, setBestSuggestions] = useState([]);
  const [popupMoves, setPopupMoves] = useState([]);
  const navigate = useNavigate();
  const validPokemons = selectedPokemon.filter(pokemon => pokemon !== null);

  useEffect(() => {
    axios.get(`${config.apiBaseUrl}/api/types`)
      .then(response => {
        setTypes(response.data);
      })
        .catch(error => console.error('Error fetching types:', error));

    axios.get(`${config.apiBaseUrl}/api/effectiveness`)
      .then(response => {
        setTypeEffectives(response.data);
      })
        .catch(error => console.error('Error fetching types:', error));
        
    axios.get(`${config.apiBaseUrl}/api/moves`)
      .then(response => {
        setMoves(response.data);
      })
        .catch(error => console.error('Error fetching types:', error));

    axios.get(`${config.apiBaseUrl}/api/pokemon-moves`)
      .then(response => {
        setPokemonMoves(response.data);
      })
        .catch(error => console.error('Error fetching types:', error));
    
        axios.get(`${config.apiBaseUrl}/api/stats`)
      .then(response => {
        setStats(response.data);
      })
      .catch(error => console.error('Error fetching types:', error));

      axios.post(`${config.apiBaseUrl}/api/type-weaknesses`, { team: selectedPokemon })
      .then(response => {
        setTypeWeaknesses(response.data);
      })
      .catch(error => console.error('Error fetching type weaknesses:', error));
      
      axios.post(`${config.apiBaseUrl}/api/three-lowest-stats`, { selectedPokemon: validPokemons }) 
      .then(response => { 
        setStatWeaknesses(response.data);
        // console.log(response.data);
      }) 
      .catch(error => console.error('Error fetching stat weaknesses:', error)); 
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      
      axios.post(`${config.apiBaseUrl}/api/team-evolve`, { team: validPokemons }) 
      .then(response => {
        // console.log(validPokemons); 
        setEvolvablePokemon(response.data);
        // console.log(response.data);
      }) 
      .catch(error => console.error('Error fetching evolvable Pokemon:', error)); 
    }
    fetchData();
  }, [selectedPokemon]);

  useEffect(() => {
    axios.post(`${config.apiBaseUrl}/api/effective-moves`, { typeWeaknesses: typeWeaknesses, selectedPokemon: validPokemons })
        .then(response => {
          setEffectiveMoves(response.data)
      })
  }, [typeWeaknesses])

  useEffect(() => {
    axios.post(`${config.apiBaseUrl}/api/best-suggestions`, { selectedPokemon: validPokemons, statWeaknesses: statWeaknesses })
        .then(response => {
          setBestSuggestions(response.data)
      })
  }, [statWeaknesses])

  useEffect(() => {
    axios.post(`${config.apiBaseUrl}/api/can-learn`, { pokemon: popupPokemon })
        .then(response => {
          console.log("use effect running")
          console.log(popupPokemon)
          setPopupMoves(response.data)
          console.log(popupMoves);
      })
  }, [popupPokemon, isPopupVisible])

  const handlePokemonClick = (pokemon) => {
    if (pokemon) {
      setPopupPokemon(pokemon);
      console.log("popupOpen")
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

  const formatStatName = (statName) => {
    return statName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };  
 
  const formatMoveName = (statName) => {
    return statName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
    'i': 'Kanto',
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
                {popupMoves.map((move, index) => (
                  <div key={index} className={styles.popupMoveRow}>
                    <div className={styles.topRow}>
                      <div className={styles.popupMoveName}>{formatMoveName(move?.move_name)}</div>
                      <div className={styles.popupMoveCategory}>{capitalizeFirstLetter(move?.category)}</div>
                    </div>
                    <div className={styles.bottomRow}>
                      <div className={styles.popupMoveType} style={{backgroundColor: `VAR(--${move?.type}`}}>
                        {capitalizeFirstLetter(move?.type)}
                      </div>
                      <div className={styles.popupMovePower}>Power: {move?.power}</div>
                      <div className={styles.popupMoveAccuracy}>Accuracy: {move?.accuracy}</div>
                      <div className={styles.popupMovePP}>PP: {move?.pp}</div>
                    </div> 
                  </div>
                ))}
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

      <div className={styles.weaknessesContainer}>
        <h1 className={styles.weaknessesTitle}>Weaknesses</h1> 
        <div className={styles.weaknessesBox}> 
          <div className={styles.lowestStatsRow}>
            {statWeaknesses && statWeaknesses.length >= 3 ? (
              <>
                <div className={styles.statBox}>
                  {formatStatName(statWeaknesses[0].stat)}
                </div>
                <div className={styles.statBox}>
                  {formatStatName(statWeaknesses[1].stat)}
                </div>
                <div className={styles.statBox}>
                  {formatStatName(statWeaknesses[2].stat)}
                </div>
              </>
            ) : (
              <div>Loading...</div>
            )}
          </div>
          {typeWeaknesses.map((type, index) => ( 
            index % 3 === 0 ? 
              <div key={index} className={styles.typeWeaknessRow}> 
                {typeWeaknesses.slice(index, index + 3).map((typeSlice, sliceIndex) => ( 
                  <div 
                    key={sliceIndex} 
                    className={styles.typeBox} 
                    style={{ backgroundColor: `VAR(--${typeSlice})` }}
                  > 
                    {capitalizeFirstLetter(typeSlice)} 
                  </div> 
                ))} 
              </div> 
            : null 
          ))}
          <div className={styles.canEvolveRow}> 
            <div className={styles.evolveBox}>Can Evolve</div> 
            <div className={styles.evolutionCircles}> 
              {evolvablePokemon.map((pokemon, index) => 
                pokemon ? ( 
                  <div 
                    key={index} 
                    className={styles.evolutionCircle}
                  > 
                    <img 
                      src={pokemon.front_sprite} 
                      alt={pokemon.name} 
                      className={styles.evolutionImage} 
                    /> 
                  </div> 
                ) : null 
              )} 
            </div> 
          </div>
        </div>
      </div>
      
      <div className= {styles.movesContainer}>
        <h1 className={styles.movesTitle}>Move Suggestions</h1>
        <div className= {styles.movesBox}>
            {effectiveMoves.map((move, index) => (
              <div key={index} className={styles.moveRow}> 
                <div className={styles.moveName}>{formatMoveName(move.name)}</div>
                <div className={styles.moveType} style={{backgroundColor: `VAR(--${move.type})` }}>{capitalizeFirstLetter(move.type)}</div>
                <div className={styles.moveCategory}>{capitalizeFirstLetter(move.category)}</div>
              </div>
            ))}
        </div>
      </div>
      
      <div className= {styles.pokeSuggContainer}>
      <h1 className={styles.pokeSuggTitle}>Pokemon Suggestions</h1>
      <div className= {styles.pokeSuggBox}>
      {bestSuggestions.map(({ pokemon, stat}, index) => (
        <div key={index} className={styles.pokeSuggRow}>
          <div className={styles.pokemonInfo}>
            <div className={styles.pokemonImageContainer}> 
              <div className={styles.pokeSuggCircle}>
                <img 
                  src={pokemon.front_sprite} 
                  alt={pokemon.name} 
                  className={styles.pokemonImage} 
                /> 
              </div>
              <div className={styles.pokemonName}>{capitalizeFirstLetter(pokemon.name)}</div> 
            </div> 
          </div> 
          <div className={styles.statInfo}>
            Better {formatStatName(stat)} 
          </div> 
          <div className={styles.typeInfo}> 
            <div className={styles.suggTypeBox1} style={{ backgroundColor: `VAR(--${getTypeName(pokemon?.type1_id)})` }}> 
              {capitalizeFirstLetter(types[pokemon.type1_id - 1].type_name)} 
            </div> {pokemon.type2_id !== '0' && ( 
              <div className={styles.suggTypeBox2} style={{ backgroundColor: `VAR(--${getTypeName(pokemon?.type2_id)})` }}> 
                {capitalizeFirstLetter(types[pokemon.type2_id - 1].type_name)} 
              </div> 
            )}
          </div>
        </div>
      ))}
      </div>
      </div>

      <div className={styles.menuButtonContainer}> 
          <button className={styles.menuButton}onClick={handleMenu}>Back to Menu</button> 
      </div>
    </div>
  );
};

export default Suggestions;