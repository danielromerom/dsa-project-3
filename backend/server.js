import express, { response } from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

async function main() {
  // connect to mysql
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });

  console.log('MySQL connected');
  
  const Pokedex = await import('pokedex-promise-v2');
  const P = new Pokedex.default();
  
  app.get('/fetch-pokemon', async (req, res) => {
    try {
      // total count of pokemon
      const { count } = await P.getPokemonsList();
      console.log(`Total Pokemon count: ${count}`);
      // go through all the pokemon in API
      for (let pokemon_id = 1; pokemon_id <= count; pokemon_id++) {
        console.log(`Fetching Pokemon with ID: ${pokemon_id}`);
        const pokemon = await P.getPokemonByName(pokemon_id);
        const species = await P.getPokemonSpeciesByName(pokemon.species.name);
    
        if (!species || !species.evolution_chain) { 
          console.warn(`Skipping Pokemon with ID ${pokemon_id} due to missing species or evolution_chain`); 
          continue; 
        }

        const evolutionChainUrl = species.evolution_chain.url;
        const evolutionChain = await fetch(evolutionChainUrl).then(response => response.json());

        if (!evolutionChain || !evolutionChain.chain) { 
          console.warn(`Skipping Pokemon with ID ${pokemon_id} due to missing evolutionChain or chain`); 
          continue; 
        }

        const can_evolve = evolutionChain.chain.evolves_to.length > 0;
      
        const name = pokemon.name;
        const type1 = pokemon.types[0].type.name;
        const type2 = pokemon.types[1] ? pokemon.types[1].type.name : null;
        const front_sprite = pokemon.sprites.front_default;
        const shiny_front_sprite = pokemon.sprites.front_shiny;
        const weight = pokemon.weight;
        const generation = species.generation ? species.generation.name.replace('generation-', '') : null;
        // get abilities
        let ability = null;
        let ability_description = null;
        let hidden_ability = null;
        let hidden_ability_description = null;

        const abilitiesPromises = pokemon.abilities.map(async (a) => { 
          const abilityData = await fetch(a.ability.url).then(response => response.json()); 
          //console.log(`Ability Data for ${a.ability.name}:`, abilityData);
          const effectEntry = abilityData.effect_entries.find(entry => entry.language.name === 'en');
          //console.log(`Ability Data for ${effectEntry.effect}:`, effectEntry); 
          return { 
            name: a.ability.name, 
            description: effectEntry ? effectEntry.effect : 'No description available in English', 
            is_hidden: a.is_hidden 
          };
        });

        const abilities = await Promise.all(abilitiesPromises);

        abilities.forEach(a => { 
          if (a.is_hidden) { 
            hidden_ability = a.name; 
            hidden_ability_description = a.description; 
          } else { 
            ability = a.name; 
            ability_description = a.description; 
          } 
        });

        // get stats
        const stats = pokemon.stats.reduce((acc, stat) => {
          switch(stat.stat.name) {
            case 'attack':
              acc.attack = stat.base_stat;
              break;
            case 'special-attack':
              acc.special_attack = stat.base_stat;
              break;
            case 'defense':
              acc.defense = stat.base_stat;
              break;
            case 'special-defense':
              acc.special_defense = stat.base_stat;
              break;
            case 'speed':
              acc.speed = stat.base_stat;
              break;
            case 'hp':
              acc.hp = stat.base_stat;
              break;
          }
          return acc;
        }, {});
  
        // check if pokemon already exists
        const [existingPokemon] = await db.query("SELECT * FROM pokemons WHERE name = ?", [name]);
        if (existingPokemon.length === 0) {
          
          // get type ids
          const [type1_id_result] = await db.query("SELECT id FROM types WHERE type_name=?", [type1]);
          const type1_id = type1_id_result[0].id;
          let type2_id = null;
          if (type2) {
            const [type2_id_result] = await db.query("SELECT id FROM types WHERE type_name=?", [type2]);
            type2_id = type2_id_result[0].id;
          }
    
          // insert stats
          const [statsResult] = await db.query(
            "INSERT INTO stats (attack, special_attack, defense, special_defense, speed, hp) VALUES (?, ?, ?, ?, ?, ?)",
            [stats.attack, stats.special_attack, stats.defense, stats.special_defense, stats.speed, stats.hp]
          );
          const stats_id = statsResult.insertId;

          // insert pokemon
          const [pokemonResult] = await db.query("INSERT INTO pokemons (name, type1_id, type2_id, stats_id, can_evolve, front_sprite, shiny_front_sprite, ability, ability_desc, hidden_ability, hidden_ability_desc, generation, weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [name, type1_id, type2_id, stats_id, can_evolve, front_sprite, shiny_front_sprite, ability, ability_description, hidden_ability, hidden_ability_description, generation, weight]
          );
          const pokemon_id = pokemonResult.insertId;
          console.log(`Inserted Pokemon with ID: ${pokemon_id}`);

          // insert moves
          const movesPromises = pokemon.moves.map(async (m) => {
            const moveData = await fetch(m.move.url).then(response => response.json());
            return {
              name: m.move.name,
              type: moveData.type.name,
              power: moveData.power,
              accuracy: moveData.accuracy,
              pp: moveData.pp,
              category: moveData.damage_class.name
            };
          });
          const moves = await Promise.all(movesPromises);

          for (const move of moves) {
            const [existingMove] = await db.query("SELECT * FROM moves WHERE move_name = ?", [move.name]);
            let move_id;
            if (existingMove.length === 0) {
              const [moveResult] = await db.query(
                "INSERT INTO moves (move_name, type, power, accuracy, pp, category) VALUES (?, ?, ?, ?, ?, ?)", 
                [move.name, move.type, move.power, move.accuracy, move.pp, move.category]
              );
              move_id = moveResult.insertId;
            } else {
              move_id = existingMove[0].id;
            }
            
            await db.query(
              "INSERT INTO pokemon_moves (pokemon_id, move_id) VALUES (?, ?)", 
              [pokemon_id, move_id]
              
            );
          }
        } else {
          console.log(`Pokemon ${name} already exists`);
        }
      }
      res.send('Pokemon data fetched and inserted into the database');
    } catch (error) {
      res.status(500).send(error.toString());
    }
  });
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

main().catch(err => {
  console.error(err);
});