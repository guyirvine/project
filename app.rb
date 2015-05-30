require 'sinatra'
require 'json'
require 'FluidDb'
require 'diplomat'

before do
  @db = FluidDb::Db(Diplomat.get( 'project-db' ))
end

after do
  @db.close
end

get '/' do
  send_file settings.public_folder + '/index.htm'
end

get '/project/:id' do
  sql = 'SELECT id, name FROM project_tbl WHERE id = ?'
  @db.queryForArray(sql, [params[:id]]).to_json
end

get '/project/:id/outcome' do
  sql = 'SELECT id, name, description FROM outcome_tbl WHERE project_id = ?'
  @db.queryForResultset(sql, [params[:id]]).to_json
end

get '/outcome/:id' do
  sql = 'SELECT id, name, description FROM outcome_tbl WHERE id = ?'
  @db.queryForArray(sql, [params[:id]]).to_json
end

get '/project/:id/persona' do
  sql = 'SELECT id, name, role FROM persona_tbl WHERE project_id = ?'
  @db.queryForResultset(sql, [params[:id]]).to_json
end

get '/persona/:id' do
  sql = 'SELECT id, name, role FROM persona_tbl WHERE id = ?'
  @db.queryForArray(sql, [params[:id]]).to_json
end

get '/project/:id/hypothesis' do
  sql = 'SELECT h.id, h.outcome_id, h.persona_id, h.description
          FROM hypothesis_tbl h
          WHERE h.project_id = ?'
  @db.queryForResultset(sql, [params[:id]]).to_json
end

get '/hypothesis/:id' do
  sql = 'SELECT id, outcome_id, description FROM hypothesis_tbl WHERE id = ?'
  @db.queryForArray(sql, [params[:id]]).to_json
end
