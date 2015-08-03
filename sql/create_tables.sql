CREATE SEQUENCE stream_seq;
CREATE SEQUENCE task_seq;

CREATE TABLE status2_tbl (
  id BIGINT NOT NULL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

INSERT INTO status2_tbl( id, name ) VALUES ( 1, 'ToDo' );
INSERT INTO status2_tbl( id, name ) VALUES ( 2, 'Doing' );
INSERT INTO status2_tbl( id, name ) VALUES ( 3, 'Done' );

CREATE TABLE stream_tbl (
  id BIGINT NOT NULL DEFAULT NEXTVAL( 'stream_seq' ) PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE task_tbl (
  id BIGINT NOT NULL DEFAULT NEXTVAL( 'task_seq' ) PRIMARY KEY,
  stream_id BIGINT NOT NULL,
  status_id BIGINT NOT NULL,
  name VARCHAR NOT NULL,
  CONSTRAINT task_stream_fk FOREIGN KEY ( stream_id ) REFERENCES stream_tbl(id),
  CONSTRAINT task_status_fk FOREIGN KEY ( status_id ) REFERENCES status2_tbl(id)
);
