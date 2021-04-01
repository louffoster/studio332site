BEGIN;
ALTER TABLE games ADD COLUMN description text;
ALTER TABLE games ADD COLUMN url varchar(80);

update games set url='/games/latticewords' where id = 1;
update games set description='Shift rows and columns of letters to form words. Make several at at time to score bonus points. Score as high as possible before time runs out.' where id = 1;

COMMIT;