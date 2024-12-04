import { shuffle } from "./shuffle.js";

export function getEffectiveMoves(typeWeaknesses, selectedPokemon, pokemonMoves, moves, typeEffectives, types) {
  // Find types that are 2x effective against the weaknesses
  const effectiveTypes = new Set();
  if (typeWeaknesses && typeWeaknesses.length > 0) {
    typeWeaknesses.forEach(weakness => {
      typeEffectives.forEach(effectiveness => {
        if (effectiveness.defender_type === weakness && parseFloat(effectiveness.effectiveness) >= 2.0) {
          effectiveTypes.add(effectiveness.attacker_type);
        }
      });
    });
  } else {
    while (effectiveTypes.size < 3) { 
      const randomIndex = Math.floor(Math.random() * 18) + 1;
      effectiveTypes.add(types.find(t => parseInt(t.id, 10) == randomIndex).type_name); 
    }
  }

  //console.log(effectiveTypes);
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


  return shuffle(effectiveMoves);
}
