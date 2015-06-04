require 'sinatra'
require 'json'
require 'FluidDb'
require 'diplomat'

before do
  faraday = Faraday.new(:url => 'http://consul.service.consul:8500', :proxy => '')
  kv = Diplomat::Kv.new(faraday)
  @db = FluidDb::Db(kv.get('project-db'))
end

after do
  @db.close
end

get '/' do
  send_file settings.public_folder + '/index.htm'
end

# *****************************************************************************
get '/project' do
  sql = 'SELECT id, name FROM project_tbl'
  @db.queryForResultset(sql, []).to_json
end

get '/project/:id' do
  sql = 'SELECT id, name FROM project_tbl WHERE id = ?'
  @db.queryForArray(sql, [params[:id]]).to_json
end

# *****************************************************************************
get '/project/:id/outcome' do
  sql = 'SELECT id, name, description, seq FROM outcome_tbl WHERE project_id = ? ORDER BY seq'
  @db.queryForResultset(sql, [params[:id]]).to_json
end

# get '/outcome/:id' do
#   sql = 'SELECT id, name, description FROM outcome_tbl WHERE id = ?'
#   @db.queryForArray(sql, [params[:id]]).to_json
# end

post '/outcome/:id' do
  request.body.rewind
  data = request.body.read
  o = JSON.parse(data)

  sql = 'UPDATE outcome_tbl SET name=?, description=?, seq=? WHERE id = ?'
  @db.execute(sql, [o['name'], o['description'], o['seq'], params[:id]])
end

post '/outcome' do
  request.body.rewind
  data = request.body.read
  o = JSON.parse(data)

  sql = 'INSERT INTO outcome_tbl( id, project_id, name, description, seq ) ' \
        "VALUES ( NEXTVAL( 'outcome_seq' ), ?, ?, ?, ? )"
  @db.execute(sql, [o['project_id'], o['name'], o['description'], o['seq']])

  @db.queryForValue("SELECT CURRVAL( 'outcome_seq' )")
end

# *****************************************************************************
get '/project/:id/backlog' do
  sql = 'SELECT id, project_id, name, description, seq FROM backlog_tbl WHERE project_id = ? ORDER BY seq'
  @db.queryForResultset(sql, [params[:id]]).to_json
end

# get '/backlog/:id' do
#   sql = 'SELECT id, name, description FROM backlog_tbl WHERE id = ?'
#   @db.queryForArray(sql, [params[:id]]).to_json
# end

post '/backlog/:id' do
  request.body.rewind
  data = request.body.read
  b = JSON.parse(data)

  sql = 'UPDATE backlog_tbl SET name=?, description=?, seq=? WHERE id = ?'
  @db.execute(sql, [b['name'], b['description'], b['seq'], params[:id]])
end

post '/backlog' do
  request.body.rewind
  data = request.body.read
  b = JSON.parse(data)

  sql = 'INSERT INTO backlog_tbl( id, project_id, name, description, seq ) ' \
          "VALUES ( NEXTVAL( 'backlog_seq' ), ?, ?, ?, ? )"
  @db.execute(sql, [b['project_id'], b['name'], b['description'], b['seq']])

  @db.queryForValue("SELECT CURRVAL( 'backlog_seq' )")
end

# *****************************************************************************
get '/project/:id/persona' do
  sql = 'SELECT id, name, role, seq FROM persona_tbl WHERE project_id = ? ORDER BY seq'
  @db.queryForResultset(sql, [params[:id]]).to_json
end

# get '/persona/:id' do
#   sql = 'SELECT id, project_id, name, role FROM persona_tbl WHERE id = ?'
#   @db.queryForArray(sql, [params[:id]]).to_json
# end

post '/persona/:id' do
  request.body.rewind
  data = request.body.read
  p = JSON.parse(data)

  sql = 'UPDATE persona_tbl SET name=?, role=?, seq=? WHERE id = ?'
  @db.execute(sql, [p['name'], p['role'], p['seq'], params[:id]])
end

post '/persona' do
  request.body.rewind
  data = request.body.read
  p = JSON.parse(data)

  sql = 'INSERT INTO persona_tbl( id, project_id, name, role, seq ) ' \
          "VALUES ( NEXTVAL('persona_seq'), ?, ?, ?, ? )"
  @db.execute(sql, [p['project_id'], p['name'], p['role'], p['seq']])

  @db.queryForValue("SELECT CURRVAL( 'persona_seq' )")
end

# *****************************************************************************
get '/project/:id/hypothesis' do
  sql = 'SELECT h.id, h.outcome_id, h.persona_id, h.description, h.seq
          FROM hypothesis_tbl h
          WHERE h.project_id = ?
          ORDER BY seq'
  @db.queryForResultset(sql, [params[:id]]).to_json
end

# get '/hypothesis/:id' do
#   sql = 'SELECT id, outcome_id, description FROM hypothesis_tbl WHERE id = ?'
#   @db.queryForArray(sql, [params[:id]]).to_json
# end

post '/hypothesis/:id' do
  request.body.rewind
  data = request.body.read
  p = JSON.parse(data)

  sql = 'UPDATE hypothesis_tbl SET outcome_id=?, persona_id=?, description=?, seq=? WHERE id = ?'
  @db.execute(sql, [p['outcome_id'], p['persona_id'], p['description'], p['seq'], params[:id]])
end

post '/hypothesis' do
  request.body.rewind
  data = request.body.read
  p = JSON.parse(data)

  sql = 'INSERT INTO hypothesis_tbl( id, project_id, outcome_id, persona_id, description, seq ) ' \
          "VALUES ( NEXTVAL('hypothesis_seq'), ?, ?, ?, ?, ? )"
  @db.execute(sql, [p['project_id'], p['outcome_id'], p['persona_id'], p['description'], p['seq']])

  @db.queryForValue("SELECT CURRVAL( 'hypothesis_seq' )")
end
