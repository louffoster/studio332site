BEGIN;
CREATE TABLE IF NOT EXISTS games (
   id serial PRIMARY KEY,
   name VARCHAR (80) UNIQUE NOT NULL
);

INSERT INTO games (name) values ('latticewords');

COMMIT;