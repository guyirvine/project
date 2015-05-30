consul: sudo $(pwd)/consul/bin/consul agent -client 0.0.0.0 -bootstrap -ui-dir /vagrant/consul/ui -config-dir $(pwd)/consul/etc/bootstrap/
project: env DB="$DB" bundle exec rerun 'ruby app.rb -p 5000 -o 0.0.0.0'
