#!/usr/bin/env bash

cd /usr/src || exit 1
if [ "$1" = 'local' ]
then
  cd app_local || exit 1
else
  echo "Updating apt"
  apt-get update
  echo "Installing git"
  apt-get install -y git
  echo "Cloning Project"
  git clone https://github.com/niborus/EU-Seite.git app_git
  cd app_git || exit 1
fi
echo "Installing package.json"
npm install
echo "Starting server. Hit ^C to terminate the process!"
node server.js
