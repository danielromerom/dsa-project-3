import { singleLowestStat } from '../singleLowestStat.js';
import { typeWeaknesses } from '../typeWeaknesses.js';
import { canEvolve } from '../canEvolve.js';

function createTypeMap(pokemonList, stats) {
  const typeMap = new Map();
  
  // create map for 18 types
  for (let i = 1; i <= 18; i++) {
    let pokeOfType = [];
    let maxAttack = pokemonList[0];
    // console.log("maxAttack: ", maxAttack);
    let maxSpecialAttack = pokemonList[0];
    let maxDefense = pokemonList[0];
    let maxSpecialDefense = pokemonList[0];
    let maxSpeed = pokemonList[0];
    let maxHp = pokemonList[0];
  
    pokemonList.forEach(pokemon => {
      if (parseInt(pokemon.type1_id, 10) === i || parseInt(pokemon.type2_id, 10) === i) {
        pokeOfType.push(pokemon);
      }
    });
    
    // console.log(pokeOfType, "List of pokemon by type", i);
    pokeOfType.forEach(pokemon => {
      const pokemonStats = stats.find(s => s.id === pokemon.stats_id);
      // console.log("current stats: ", pokemonStats);

      const attackStats = stats.find(s => s.id === maxAttack.stats_id);
      // console.log("current maxattack stats: ", maxAttack.stats_id);
      if ((pokemonStats.attack) > (attackStats.attack)) {
        maxAttack = pokemon;
      }

      const spAttackStats = stats.find(s => s.id === maxSpecialAttack.stats_id);
      if ((pokemonStats.special_attack) > (spAttackStats.special_attack)) {
        maxSpecialAttack = pokemon;
      }

      const defenseStats = stats.find(s => s.id === maxDefense.stats_id);
      if ((pokemonStats.defense) > (defenseStats.defense)) {
        maxDefense = pokemon;
      }

      const spDefenseStats = stats.find(s => s.id === maxSpecialDefense.stats_id);
      if ((pokemonStats.special_defense) > (spDefenseStats.special_defense)) {
        maxSpecialDefense = pokemon;
      }

      const speedStats = stats.find(s => s.id === maxSpeed.stats_id);
      if ((pokemonStats.speed) > (speedStats.speed)) {
        maxSpeed = pokemon;
      }

      const hpStats = stats.find(s => s.id === maxHp.stats_id);
      if ((pokemonStats.hp) > (hpStats.hp)) {
        maxHp = pokemon;
      }
    })

    const statMap = new Map();

    statMap.set("attack", maxAttack);
    statMap.set("special_attack", maxSpecialAttack);
    statMap.set("defense", maxDefense);
    statMap.set("special_defense", maxSpecialDefense);
    statMap.set("speed", maxSpeed);
    statMap.set("hp", maxHp);

    typeMap.set(i, statMap);
  }

  return typeMap;
}

function pokeMap(data) {
  let team = Array(6).fill(null);
  const { pokemons, stats, typeEffectives, types } = data;

  // Generate a random base Pokémon
  const baseIndex = Math.floor(Math.random() * pokemons.length);
  let basePokemon = pokemons[baseIndex];

  // Replace with highest evolution if it can evolve
  basePokemon = canEvolve(basePokemon, pokemons);

  team[0] = basePokemon;
  const weaknesses = typeWeaknesses([basePokemon], typeEffectives, types) || [];
  // console.log(weaknesses);

  // Create map
  const typeMap = createTypeMap(pokemons, stats);
  // console.log("map ", typeMap);

  for (let i = 1; i < team.length; i++) {
    const lowestStat = singleLowestStat(team, stats);
    // console.log(lowestStat);
    
    const randomIndex = Math.floor(Math.random() * weaknesses.length);
    const type = weaknesses[randomIndex];
    console.log(type);
    // Find a type with 2x strength to the weakness
    const effectiveMatch = (typeEffectives.find(e => e.defender_type === type && e.effectiveness === "2.0")).attacker_type; 

    const typeId = types.find(t => t.type_name === effectiveMatch).id;
    // console.log("typeid: ", typeId);

    const statMap = typeMap.get(parseInt(typeId, 10));

    const bestPokemon = statMap.get(lowestStat.stat);
    team[i] = bestPokemon;
  }

  //// console.log("Final Pokémon team:", team);
  return team;
}

export { pokeMap }