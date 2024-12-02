import express from 'express';
import cors from 'cors';
import { loadCSVData } from './dataExtractor.js';
import { threeLowestStats } from './threeLowestStats.js';
import { singleLowestStat } from './singleLowestStat.js';
import { lowestPokemonFromStat } from './lowestPokemonFromStat.js';
import { betterPokemonTypeStat } from './betterPokemonTypeStat.js'; 
import { canEvolve } from './canEvolve.js'; 
import { typeWeaknesses } from './typeWeaknesses.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let data= {};
async function loadData() {
  data.pokemons = await loadCSVData('./csv/pokemons.csv');
  data.stats = await loadCSVData('./csv/stats.csv');
  data.types = await loadCSVData('./csv/types.csv');
  data.typeEffectives = await loadCSVData('./csv/type_effectives.csv');
  data.moves = await loadCSVData('./csv/moves.csv');
  data.pokemonMoves = await loadCSVData('./csv/pokemon_moves.csv');
}

loadData().catch(error => { 
  console.error('Error loading data:', error);
});

app.get('/api/pokemons', (req, res) => {
  res.json(data.pokemons);
});

app.get('/api/types', (req, res) => {
  res.json(data.types);
});


app.post('/api/three-lowest-stats', express.json(), (req, res) => {
  const { selectedPokemon } = req.body;
  const result = threeLowestStats(selectedPokemon, data.stats);
  res.json(result);
});

app.post('/api/single-lowest-stat', (req, res) => {
  const { selectedPokemon } = req.body;
  const result = singleLowestStat(selectedPokemon, data.stats);
  res.json(result); 
});

app.post('/api/lowest-pokemon-from-stat', (req, res) => { 
  const { stat } = req.body; 
  const result = lowestPokemonFromStat(data.pokemons, data.stats, stat); 
  res.json(result); 
});

app.post('/api/better-pokemon-type-stat', (req, res) => { 
  const { lowestPokemon, stat } = req.body; 
  const result = betterPokemonTypeStat(lowestPokemon, stat, data.pokemons, data.stats); 
  res.json(result); 
});

app.post('/api/can-evolve', (req, res) => { 
  const { pokemon } = req.body; 
  const result = canEvolve(pokemon, data.pokemons); 
  res.json(result); 
});

app.post('/api/type-weaknesses', (req, res) => { 
  const { team } = req.body; 
  const result = typeWeaknesses(team, data.typeEffectives, data.types); 
  res.json(result); 
});

app.listen(port, () => {
  console.log(`Server running at http:/localhost:${port}`);
});