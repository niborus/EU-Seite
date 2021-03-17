#!/bin/bash

cd /usr/src || exit 1
if [ "$1" = 'local' ]
then
  cd app_local || exit 1
else
  echo "Updating apt"
  apt-get update
  echo "Installing required programms"
  apt-get install -y git
  if [ -d app_git ]
  then
    cd app_git || exit 1
    echo "Pull Updates"
    git pull origin || ( echo -e 'Can not pull changes from origin.\nTry "docker-compose down && docker-compose up"'; exit 1 )
  else
    echo "Clone Project"
    git clone https://github.com/niborus/EU-Seite.git app_git || exit 1
    cd app_git || exit 1
  fi
fi
echo "Installing package.json"
npm install
echo "Starting server. Hit ^C to terminate the process!"
node server.js
