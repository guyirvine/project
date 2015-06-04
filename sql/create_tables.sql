ALTER TABLE outcome_tbl ADD seq INT;
UPDATE outcome_tbl SET seq=id;
ALTER TABLE outcome_tbl ALTER COLUMN seq SET NOT NULL;

ALTER TABLE persona_tbl ADD seq INT;
UPDATE persona_tbl SET seq=id;
ALTER TABLE persona_tbl ALTER COLUMN seq SET NOT NULL;

ALTER TABLE hypothesis_tbl ADD seq INT;
UPDATE hypothesis_tbl SET seq=id;
ALTER TABLE hypothesis_tbl ALTER COLUMN seq SET NOT NULL;

ALTER TABLE backlog_tbl ADD seq INT;
UPDATE backlog_tbl SET seq=id;
ALTER TABLE backlog_tbl ALTER COLUMN seq SET NOT NULL;
