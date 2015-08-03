dropdb project
createdb project
psql -f project.sql project
psql -f create_tables.sql project
psql -f seed.sql project
