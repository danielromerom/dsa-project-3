export function canEvolve(pokemon, pokemons) {
  let currentPokemon = pokemon;

  // check for max two evolutions
  for (let i = 0; i < 2; i++) {
    const nextPokemonIndex = pokemons.findIndex(p => p.id === currentPokemon.id) + 1;
    if (nextPokemonIndex >= pokemons.length) {
      break;
    }

    const nextPokemon = pokemons[nextPokemonIndex];

    // check if the next Pokémon has the same type and is in an evolution chain
    if ((nextPokemon.type1_id === currentPokemon.type1_id || nextPokemon.type2_id === currentPokemon.type1_id ||
        nextPokemon.type1_id === currentPokemon.type2_id || (nextPokemon.type2_id !== "0" && nextPokemon.type2_id === currentPokemon.type2_id)) &&
        nextPokemon.can_evolve && (parseInt(nextPokemon.weight) > parseInt(currentPokemon.weight))) {
      currentPokemon = nextPokemon;
    } else {
      break;
    }
  }

  return currentPokemon;
}
