export function getEffectiveMoves(typeWeaknesses, selectedPokemon, pokemonMoves, moves, typeEffectives, types) {
  // Find types that are 2x effective against the weaknesses
  const effectiveTypes = new Set();
  if (typeWeaknesses) {
    typeWeaknesses.forEach(weakness => {
      typeEffectives.forEach(effectiveness => {
        if (effectiveness.defender_type === weakness && parseFloat(effectiveness.effectiveness) >= 2.0) {
          effectiveTypes.add(effectiveness.attacker_type);
        }
      });
    });
  } else {
    const getRandomInt = (max) => Math.floor(Math.random() * max) + 1; 
    const allTypes = types.map(type => type.type_name.toLowerCase()); 
    while (effectiveTypes.size < 3) { 
      const randomIndex = getRandomInt(allTypes.length) - 1; 
      effectiveTypes.add(allTypes[randomIndex]); 
    }
  }


  // Find moves that match the effective types for each Pokémon in the team
  const effectiveMoves = [];
  selectedPokemon.forEach(pokemon => {
    const pokemonMovesForPokemon = pokemonMoves.filter(pm => pm.pokemon_id === pokemon.id);
    pokemonMovesForPokemon.forEach(pokemonMove => {
      const move = moves.find(m => m.id === pokemonMove.move_id);
      if (move && effectiveTypes.has(move.type)) {
        effectiveMoves.push({
          name: move.move_name,
          type: move.type,
          category: move.category,
          pokemonId: pokemon.id,
        });
      }
    });
  });

  return effectiveMoves;
}
