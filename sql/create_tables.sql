ALTER TABLE outcome_tbl ALTER COLUMN description SET DEFAULT '';
UPDATE outcome_tbl SET description='' WHERE description IS NULL;
ALTER TABLE outcome_tbl ALTER COLUMN description SET NOT NULL;

ALTER TABLE persona_tbl ALTER COLUMN description SET DEFAULT '';
UPDATE persona_tbl SET description='' WHERE description IS NULL;
ALTER TABLE persona_tbl ALTER COLUMN description SET NOT NULL;

ALTER TABLE hypothesis_tbl ALTER COLUMN status_id SET NOT NULL;

ALTER TABLE hypothesis_tbl ALTER COLUMN testing SET DEFAULT '';
UPDATE hypothesis_tbl SET testing='' WHERE testing IS NULL;
ALTER TABLE hypothesis_tbl ALTER COLUMN testing SET NOT NULL;
