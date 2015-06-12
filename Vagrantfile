#Bootstrap script for installing Go and setting correct environments
$bootstrapScript = <<SCRIPT
GO_VERSION=1.4.2
echo 'Updating and installing ubuntu packages...'
sudo apt-get update
sudo apt-get install -y git postgresql-9.3

echo 'Setup postgres...'
su -c '/usr/bin/createuser -s vagrant' postgres
su -c "psql -c \"ALTER ROLE vagrant WITH PASSWORD 'vagrant'\" template1" postgres


echo 'Downloading go$GO_VERSION.linux-amd64.tar.gz'
wget –quiet https://storage.googleapis.com/golang/go$GO_VERSION.linux-amd64.tar.gz
echo 'Unpacking go language'
sudo tar -C /usr/local -xzf go$GO_VERSION.linux-amd64.tar.gz
echo 'Setting upp correct env. variables'
echo "export GOPATH=/vagrant/" >> /home/vagrant/.bashrc
echo "export PATH=$PATH:/vagrant/bin:/usr/local/go/bin" >> /home/vagrant/.bashrc
echo "cd /vagrant" >> /home/vagrant/.bashrc

SCRIPT

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  # Using Ubuntu 14.04
  config.vm.box = "ubuntu/trusty64"
  # Forwarding port 8080 to local 8080.
  config.vm.network "forwarded_port", guest: 5001, host: 5001
  #Calling bootstrap setup
  config.vm.provision "shell", privileged: false, inline: $bootstrapScript
end
