#!/bin/bash

cd /usr/src
if [ $1 = 'g' ]
then
  echo "Updating apt"
  apt-get update
  echo "Installing git"
  apt-get install -y git
  echo "Cloning Project"
  git clone https://github.com/niborus/EU-Seite.git app
  cd app
  #echo -e "\n\n################################"
  #read -p "Checkout Branch? (Leave empty to use default branch.): " userinput_branch
  #if [ -n $userinput_branch ]
  #then
  #  echo "Checkout to branch $userinput_branch."
  #  git checkout $userinput_branch
  #fi
else
  cd app
fi
echo "Installing package.json"
npm install
echo "Starting server. Hit ^C to terminate the process!"
node server.js
