CREATE SEQUENCE project_seq;
CREATE SEQUENCE outcome_seq;
CREATE SEQUENCE hypothesis_seq;
CREATE SEQUENCE persona_seq;


CREATE TABLE project_tbl (
  id BIGINT NOT NULL DEFAULT NEXTVAL( 'project_seq' ) PRIMARY KEY,
  name VARCHAR NOT NULL
);

CREATE TABLE outcome_tbl (
  id BIGINT NOT NULL DEFAULT NEXTVAL( 'outcome_seq' ) PRIMARY KEY,
  project_id BIGINT NOT NULL,
  name VARCHAR NOT NULL,
  description VARCHAR,
  CONSTRAINT outcome_project_fk FOREIGN KEY ( project_id ) REFERENCES project_tbl(id)
);

CREATE TABLE persona_tbl (
  id BIGINT NOT NULL DEFAULT NEXTVAL( 'persona_seq' ) PRIMARY KEY,
  project_id BIGINT NOT NULL,
  name VARCHAR NOT NULL,
  role VARCHAR NOT NULL,
  description VARCHAR,
  CONSTRAINT persona_project_fk FOREIGN KEY ( project_id ) REFERENCES project_tbl(id)
);

CREATE TABLE hypothesis_tbl (
  id BIGINT NOT NULL DEFAULT NEXTVAL( 'hypothesis_seq' ) PRIMARY KEY,
  project_id BIGINT NOT NULL,
  persona_id BIGINT NOT NULL,
  outcome_id BIGINT NOT NULL,
  description VARCHAR NOT NULL,
  CONSTRAINT hypothesis_project_fk FOREIGN KEY ( project_id ) REFERENCES project_tbl(id),
  CONSTRAINT hypothesis_persona_fk FOREIGN KEY ( persona_id ) REFERENCES persona_tbl(id),
  CONSTRAINT hypothesis_outcome_fk FOREIGN KEY ( outcome_id ) REFERENCES outcome_tbl(id)
);
