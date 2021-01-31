#!/bin/bash

cd /usr/src
if [ $1 = 'local' ]
then
  cd app_local
else
  echo "Updating apt"
  apt-get update
  echo "Installing git"
  apt-get install -y git
  echo "Cloning Project"
  git clone https://github.com/niborus/EU-Seite.git app_git
  cd app_git
fi
echo "Installing package.json"
npm install
echo "Starting server. Hit ^C to terminate the process!"
node server.js
