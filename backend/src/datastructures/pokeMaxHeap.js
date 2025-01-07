import MaxHeap from './maxHeap.js';
import { singleLowestStat } from '../singleLowestStat.js';
import { typeWeaknesses } from '../typeWeaknesses.js';

// generate random type and random stat to pick the first pokemon of the team
function getRandomType() {
  return Math.floor(Math.random() * 18) + 1;
}

function getRandomStat() {
  const stats = ['attack', 'special_attack', 'special_defense', 'defense', 'speed', 'hp'];
  const randomIndex = Math.floor(Math.random() * stats.length);
  return stats[randomIndex];
}

// generate heap based on the type and stat
function createMaxHeap(pokemonList, pokemonType, stat, stats) {
  const heap = new MaxHeap();
  
  console.log("inside create - stat: ", stat, " type: ", pokemonType)

  pokemonList.forEach(pokemon => {
    // console.log(pokemon.type1_id);
    // console.log(`Processing Pokémon: ${pokemon.name}, Type1: ${pokemon.type1_id}, Type2: ${pokemon.type2_id}`);
    if (pokemonType === null || toString(pokemon.type1_id) === toString(pokemonType) || pokemon.type2 === toString(pokemonType)) {
      const pokemonStats = stats.find(s => s.id === pokemon.stats_id);
      // console.log("pokemonStat: ", pokemonStats);
      const statValue = parseInt(pokemonStats[stat], 10);
      //console.log("Stat Value: ", statValue)
      //console.log(`Processing Pokémon: ${pokemon.name}, Type1: ${pokemon.type1_id}, Type2: ${pokemon.type2_id}`);
      heap.insert({ key: statValue, value: pokemon.id });
    }
  });
  //console.log("picked type: ", pokemonType);
  // console.log("picked stat: ", stat);
  console.log(heap);
  return heap;
}

function pokeMaxHeap(data) {
  let team = Array(6).fill(null);
  const pokemonList = data.pokemons;
  const stats = data.stats;
  
  // pick the first Pokémon
  const typeStart = getRandomType();
  const statStart = getRandomStat();
  let heap = createMaxHeap(pokemonList, typeStart, statStart, data.stats);
  let maxPokemon = heap.delete();
  console.log(heap);
  team[0] = data.pokemons.find(pokemon => pokemon.id === maxPokemon.value);
  console.log(team);
  
  // repeat until the team has 6 Pokémon
  for (let i = 1; i < team.length; i++) {
    console.log("sls t: ", team[0]);
    //console.log("sls s: ", data.stats);

    let lowestStat = singleLowestStat(team, stats);
    console.log("Lowest stat is: ", lowestStat);
    const weaknesses = typeWeaknesses(team, data.typeEffectives, data.types);
    
    let added = false;

    if (weaknesses && weaknesses.length > 0) {
      const randomWeakness = weaknesses[Math.floor(Math.random() * weaknesses.length)];
      const weaknessId = data.types.find(t => t.type_name.toLowerCase() === randomWeakness.toLowerCase());
      console.log("picked weakness: ", randomWeakness, " ", weaknessId);
      heap = createMaxHeap(pokemonList, weaknessId, lowestStat.stat, data.stats);
      if (heap.size() > 0) {
        maxPokemon = heap.delete();
        team[i] = data.pokemons.find(pokemon => pokemon.id === maxPokemon.value);
        lowestStat = singleLowestStat(team, stats);
        added = true;
      } 
    }
  
     // if there are no weaknesses found
    if (!added) { 
      heap = createMaxHeap(pokemonList, null, lowestStat.stat, data.stats);
      maxPokemon = heap.delete();
      if (maxPokemon) {
        team[i] = data.pokemons.find(pokemon => pokemon.id === maxPokemon.value);
      }
    }
  }

  console.log("Final Pokémon team:", team);
  return team;  
}

export { pokeMaxHeap }
