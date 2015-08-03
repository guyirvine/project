INSERT INTO stream_tbl( id, name ) VALUES ( NEXTVAL( 'stream_seq' ), 'Stream A' );
INSERT INTO task_tbl( id, stream_id, status_id, name ) VALUES ( NEXTVAL( 'task_seq' ), CURRVAL( 'stream_seq' ), 1, 'Item A.1' );
INSERT INTO task_tbl( id, stream_id, status_id, name ) VALUES ( NEXTVAL( 'task_seq' ), CURRVAL( 'stream_seq' ), 1, 'Item A.2' );
INSERT INTO task_tbl( id, stream_id, status_id, name ) VALUES ( NEXTVAL( 'task_seq' ), CURRVAL( 'stream_seq' ), 2, 'Item A.3' );
INSERT INTO task_tbl( id, stream_id, status_id, name ) VALUES ( NEXTVAL( 'task_seq' ), CURRVAL( 'stream_seq' ), 3, 'Item A.4' );

INSERT INTO stream_tbl( id, name ) VALUES ( NEXTVAL( 'stream_seq' ), 'Stream B' );
