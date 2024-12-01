DROP TABLE IF EXISTS stats;
DROP TABLE IF EXISTS moves;
DROP TABLE IF EXISTS pokemon_moves;
DROP TABLE IF EXISTS pokemons;

CREATE TABLE stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  attack INT NOT NULL,
  special_attack INT NOT NULL,
  defense INT NOT NULL,
  special_defense INT NOT NULL,
  speed INT NOT NULL,
  hp INT NOT NULL
);

CREATE TABLE moves (
  id INT AUTO_INCREMENT PRIMARY KEY,
  move_name VARCHAR(255),
  type VARCHAR(50),
  power INT,
  accuracy INT,
  pp INT,
  category VARCHAR(50)
);

CREATE TABLE pokemon_moves (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pokemon_id INT,
  move_id INT,
  FOREIGN KEY (pokemon_id) REFERENCES pokemons(id),
  FOREIGN KEY (move_id) REFERENCES moves(id)
);

CREATE TABLE pokemons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  type1_id INT NOT NULL,
  type2_id INT,
  stats_id INT,
  can_evolve BOOLEAN,
  front_sprite VARCHAR(255) NOT NULL,
  shiny_front_sprite VARCHAR(255) NOT NULL,
  ability VARCHAR(255),
  ability_desc VARCHAR(2000),
  hidden_ability VARCHAR(255),
  hidden_ability_desc VARCHAR(2000),
  generation VARCHAR(50),
  weight INT NOT NULL,
  FOREIGN KEY (type1_id) REFERENCES types(id), 
  FOREIGN KEY (type2_id) REFERENCES types(id), 
  FOREIGN KEY (stats_id) REFERENCES stats(id)
);

