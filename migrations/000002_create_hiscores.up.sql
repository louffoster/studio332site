BEGIN;
CREATE TABLE IF NOT EXISTS high_scores (
   id serial PRIMARY KEY,
   game_id integer NOT NULL REFERENCES games(id) ON DELETE CASCADE,
   player VARCHAR (10) NOT NULL,
   score integer NOT NULL
);

COMMIT;