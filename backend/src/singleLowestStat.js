export function singleLowestStat(pokemons, stats) {
  // initialize object with stats
  const combinedStats = {
    hp: 0,
    attack: 0,
    defense: 0,
    special_attack: 0,
    special_defense: 0,
    speed: 0
  };

  // sum stats for all pokemon in pokemons
  pokemons.forEach(pokemon => {
    const pokemonStats = stats.find(stat => stat.id === pokemon.stats_id);
    for (let stat in combinedStats) {
      combinedStats[stat] += parseInt(pokemonStats[stat]);
    }
  });

  // convert the stats to array for sorting
  const statsArray = Object.keys(combinedStats).map(stat => ({
    stat,
    value: combinedStats[stat]
  }));

  // sort by stat values in ascending order
  statsArray.sort((a, b) => a.value - b.value);

  return statsArray[0];
}
