export function betterPokemonTypeStat(pokemon, stat, pokemons, stats) {
  const { type1_id, type2_id, stats_id } = pokemon;
  const pokemonStats = stats.find(s => s.id === stats_id);

  // filters pokemon to only be pokemon of the same type as one of the types of the given pokemon
  const filteredPokemons = pokemons.filter(p => 
    (p.type1_id === type1_id || p.type2_id === type1_id ) || 
(type2_id !== "0" && (p.type1_id === type2_id || p.type2_id === type2_id))
  );

  // returns pokemons that have better stats
  const betterPokemons = filteredPokemons.filter(p => {
    const pStats = stats.find(s => s.id === p.stats_id);
    return pStats[stat] > pokemonStats[stat];
  });

  return betterPokemons.length > 0 ? betterPokemons : null;
}
