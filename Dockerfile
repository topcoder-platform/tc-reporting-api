FROM node:6.9.4
LABEL version="1.0"
LABEL description="Reporting microservice"

RUN sed -i '/jessie-updates/d' /etc/apt/sources.list
RUN sed -i 's/httpredir/archive/' /etc/apt/sources.list
RUN sed -i 's/security.debian.org/archive.debian.org\/debian-security/' /etc/apt/sources.list
RUN sed -i 's/deb.debian/archive.debian/' /etc/apt/sources.list

RUN apt-get update && \
    apt-get upgrade -y --force-yes

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app
# Install app dependencies
RUN npm install
RUN npm run -s build

EXPOSE 3000

CMD ["npm", "start"]
