#!/usr/bin/env bash

su -c '/usr/bin/createuser -s vagrant' postgres
echo 'cd /vagrant' >> /home/vagrant/.bashrc
psql -c "ALTER ROLE vagrant WITH PASSWORD 'vagrant'" template1

cd /vagrant

bundle install
