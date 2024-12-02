import { canEvolve } from "./canEvolve.js";

export function teamEvolve(team, pokemons) {
  if (!team || team.length === 0) {
    return [];
  }

  const evolvablePokemons = team.map(pokemon => {
    return canEvolve(pokemon, pokemons);
  });

  const evolvable = evolvablePokemons.filter(pokemon => pokemon && pokemon.id !== team.find(p => p.id === pokemon.id)?.id);

  return evolvable;
}