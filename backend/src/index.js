import { loadCSVData } from './dataExtractor.js';
import { threeLowestStats } from './threeLowestStats.js';
import { singleLowestStat } from './singleLowestStat.js';
import { lowestPokemonFromStat } from './lowestPokemonFromStat.js';
import { betterPokemonTypeStat } from './betterPokemonTypeStat.js'; 
import { canEvolve } from './canEvolve.js'; 
import { typeWeaknesses } from './typeWeaknesses.js';

async function main() {
  try {
    // loading csv files
    const pokemons = await loadCSVData('./csv/pokemons.csv');
    const stats = await loadCSVData('./csv/stats.csv');
    const types = await loadCSVData('./csv/types.csv');
    const typeEffectives = await loadCSVData('./csv/type_effectives.csv');
    const moves = await loadCSVData('./csv/moves.csv');
    const pokemonMoves = await loadCSVData('./csv/pokemon_moves.csv');

    // make a team with the first 6 pokemon
    const team = pokemons.slice(0, 3);

    const threeLowest = threeLowestStats(pokemons, stats); 
    console.log('Three Lowest Stats:', threeLowest);

    const singleLowest = singleLowestStat(pokemons, stats); 
    console.log('Single Lowest Stat:', singleLowest);

    const lowestPokemon = lowestPokemonFromStat(pokemons, stats, 'attack'); 
    console.log('Lowest Pokemon by Attack Stat:', lowestPokemon); 

    const betterPokemon = betterPokemonTypeStat(lowestPokemon, 'attack', pokemons, stats);
    console.log('Better Pokémon for Attack:', betterPokemon);

    const highestEvolution = canEvolve(team[0], pokemons); 
    console.log('Highest Evolution:', highestEvolution); 

    const weaknesses = typeWeaknesses(team, typeEffectives, types); 
    console.log('Team Weaknesses:', weaknesses);

  } catch (error) { 
    console.error('Error:', error);
  }
}

main();