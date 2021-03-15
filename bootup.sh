#!/bin/bash

cd /usr/src || exit 1
if [ "$1" = 'local' ]
then
  cd app_local || exit 1
else
  echo "Updating apt"
  apt-get update
  echo "Installing required programms"
  apt-get install -y unzip
  if [ -d app_git ]
  then
    echo "Removing old Project Files"
    rm -rf app_git
  fi
  echo "Download Project"
  wget -O app_git.zip "https://github.com/niborus/EU-Seite/archive/main.zip" || exit 1
  echo "Unpack Project"
  unzip -o -q app_git.zip -d app_git
  cd app_git || exit 1
fi
echo "Installing package.json"
npm install
echo "Starting server. Hit ^C to terminate the process!"
node server.js
