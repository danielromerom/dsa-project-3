SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS types;

CREATE TABLE types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type_name VARCHAR(50) NOT NULL
);

INSERT INTO types (type_name) 
VALUES 
  ('normal'), ('fire'), ('water'), ('grass'), ('electric'), ('ice'), ('fighting'), ('poison'), ('ground'),
  ('flying'), ('psychic'), ('bug'), ('rock'), ('ghost'), ('dragon'), ('dark'), ('steel'), ('fairy');