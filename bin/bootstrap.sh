#!/usr/bin/env bash

su -c '/usr/bin/createuser -s vagrant' postgres
su -c 'psql -c "ALTER ROLE vagrant WITH PASSWORD vagrant" template1' postgres
echo 'cd /vagrant' >> /home/vagrant/.bashrc

echo 'nameserver 10.0.2.15' > /etc/resolv.conf
echo 'nameserver 10.0.2.3' >> /etc/resolv.conf
echo 'search service.consul' >> /etc/resolv.conf

echo '10.0.2.15 consul.service.consul' >> /etc/hosts

cd /vagrant

bundle install

su -c 'rake rdb' jenkins
