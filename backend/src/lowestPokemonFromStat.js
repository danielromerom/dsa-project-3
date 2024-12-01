export function lowestPokemonFromStat(pokemons, stats, statName) {
  // find pokemon that has the lowest stat
  let lowestPokemon = null;
  let lowestValue = Infinity;

  pokemons.forEach(pokemon => {
    const pokemonStats = stats.find(stat => stat.id === pokemon.stats_id);
      if (pokemonStats[statName] < lowestValue) {
        lowestValue = pokemonStats[statName];
        lowestPokemon = pokemon;
      }
  });
  
  return lowestPokemon;
}