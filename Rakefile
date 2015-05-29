require 'rake/testtask'

task :db do
  `createdb project`
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
