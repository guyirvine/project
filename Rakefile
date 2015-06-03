require 'rake/testtask'

task :getdb do
  `scp dexter.guyirvine.com:/guyirvine.com/backup/project.sql.latest.tar.bz2 ./sql`
  `cd sql && tar -jxf project.sql.latest.tar.bz2 && rm project.sql.latest.tar.bz2`
end

task :db do
  `createdb project`
  `psql -f sql/project.sql project`
  `psql -f sql/create_tables.sql project`
  `psql -f sql/seed.sql project`
end

task :rdb do
  `dropdb project`
  Rake::Task["db"].invoke
end


Rake::TestTask.new do |t|
  t.libs << 'test'
end

desc "Run tests"
$:.unshift "./Lib"
task :default => :test
