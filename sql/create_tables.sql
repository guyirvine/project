CREATE SEQUENCE stream_seq;

CREATE TABLE stream_tbl (
  id BIGINT NOT NULL DEFAULT NEXTVAL( 'stream_seq' ) PRIMARY KEY,
  project_id BIGINT NOT NULL,
  name VARCHAR NOT NULL,
  CONSTRAINT stream_project_fk FOREIGN KEY ( project_id ) REFERENCES project_tbl(id)
);

ALTER TABLE hypothesis_tbl
  ADD COLUMN stream_id BIGINT NOT NULL;

ALTER TABLE hypothesis_tbl
  ADD CONSTRAINT hypothesis_stream_fk FOREIGN KEY ( stream_id ) REFERENCES stream_tbl( id );
