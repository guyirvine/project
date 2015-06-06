CREATE TABLE status_tbl (
  id BIGINT NOT NULL PRIMARY KEY,
  name VARCHAR NOT NULL,
  seq INT
);

INSERT INTO status_tbl ( id, name, seq ) VALUES ( 1, 'Backlog', 1 );
INSERT INTO status_tbl ( id, name, seq ) VALUES ( 2, 'Open', 2 );
INSERT INTO status_tbl ( id, name, seq ) VALUES ( 3, 'Closed', 3 );

ALTER TABLE hypothesis_tbl ADD status_id BIGINT DEFAULT 2;
ALTER TABLE hypothesis_tbl ADD CONSTRAINT hypothesis_status_fk FOREIGN KEY ( status_id ) REFERENCES status_tbl( id );
