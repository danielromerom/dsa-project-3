import { betterPokemonTypeStat } from "./betterPokemonTypeStat.js";
import { lowestPokemonFromStat } from "./lowestPokemonFromStat.js";
import { shuffle } from "./shuffle.js"

export function getBestSuggestions(selectedPokemon, statWeaknesses, pokemons, stats) {
  const suggestions = [];

  statWeaknesses.forEach(({ stat }) => { 
    const lowestPokemon = lowestPokemonFromStat(selectedPokemon, stats, stat); 
    if (lowestPokemon) { 
      const betterPokemons = betterPokemonTypeStat(lowestPokemon, stat, pokemons, stats); 
      if (betterPokemons) { 
        suggestions.push(...betterPokemons.map(pokemon => ({ pokemon, stat }))); 
      } 
    } 
  });

  return shuffle(suggestions);
};