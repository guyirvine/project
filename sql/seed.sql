INSERT INTO project_tbl ( name )
  VALUES ( 'Jobs On Farm' );

INSERT INTO outcome_tbl ( project_id, name )
  VALUES ( CURRVAL( 'project_seq'), 'Remote Management' );

INSERT INTO persona_tbl ( project_id, name, role )
  VALUES ( CURRVAL( 'project_seq'), 'Shane', 'Ops Manager' );

INSERT INTO hypothesis_tbl ( project_id, persona_id, outcome_id, description )
  VALUES ( CURRVAL( 'project_seq'), CURRVAL( 'persona_seq'), CURRVAL( 'outcome_seq'), 'View 1' );
INSERT INTO hypothesis_tbl ( project_id, persona_id, outcome_id, description )
  VALUES ( CURRVAL( 'project_seq'), CURRVAL( 'persona_seq'), CURRVAL( 'outcome_seq'), 'View 2' );
