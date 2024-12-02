export function typeWeaknesses(pokemons, typeEffectives, types) {
  // Create a map from type IDs to type names
  const validPokemons = pokemons.filter(pokemon => pokemon !== null);
  
  const typeMap = {};
  types.forEach(type => {
    typeMap[parseInt(type.id)] = type.type_name.toLowerCase();
  });

  // Debug: Print the typeMap
  // console.log('Type Map:', typeMap);

  // Function to calculate weaknesses for a single Pokémon
  function calculateWeaknesses(type1, type2) {
    const weaknesses = {};

    typeEffectives.forEach(effectiveness => {
      if (effectiveness.defender_type === typeMap[type1]) {
        weaknesses[effectiveness.attacker_type] = 
          (weaknesses[effectiveness.attacker_type] || 1) * parseFloat(effectiveness.effectiveness);
      }
      if (type2 && type2 !== "0" && effectiveness.defender_type === typeMap[type2]) {
        weaknesses[effectiveness.attacker_type] = 
          (weaknesses[effectiveness.attacker_type] || 1) * parseFloat(effectiveness.effectiveness);
      }
    });

    // Debug: Print the weaknesses for this Pokémon
    // console.log(`Weaknesses for types ${type1} and ${type2}:`, weaknesses);
    
    return weaknesses;
  }

  // Calculate weaknesses for each Pokémon in the team
  const teamWeaknesses = validPokemons.map(pokemon => {
    return calculateWeaknesses(pokemon.type1_id, pokemon.type2_id);
  });

  // Debug: Print the team weaknesses
  // console.log('Team Weaknesses:', teamWeaknesses);

  // Determine common weaknesses across the team
  const commonWeaknesses = {};
  typeEffectives.forEach(effectiveness => {
    const attackerType = effectiveness.attacker_type;
    let allWeak = true;

    for (let pokemonWeaknesses of teamWeaknesses) {
      if (!(attackerType in pokemonWeaknesses) || pokemonWeaknesses[attackerType] < 2.0) {
        allWeak = false;
        break;
      }
    }

    if (allWeak) {
      commonWeaknesses[attackerType] = true;
    }
  });

  // Debug: Print the common weaknesses
  // console.log('Common Weaknesses:', commonWeaknesses);

  // Convert common weaknesses to an array
  const weaknessesArray = Object.keys(commonWeaknesses);

  // console.log('Final Team Weaknesses:', weaknessesArray);
  return weaknessesArray;
}
