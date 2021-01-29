FROM node:14

# Create app directory
WORKDIR /usr/src

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY package*.json ./

#RUN apt-get update && apt-get install -y git
#RUN git clone https://github.com/niborus/EU-Seite.git .
#RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY bootup.sh bootup.sh

EXPOSE 8080
#CMD [ "node", "server.js" ]
