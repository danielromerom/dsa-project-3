export function canLearn(pokemon, pokemonMoves, moves) {
  const movesForPokemon = pokemonMoves.filter(pm => pm.pokemon_id === pokemon?.id);
  const moveDetails = movesForPokemon.map(pm => moves.find(m => m.id === pm.move_id));

  return moveDetails;
}
