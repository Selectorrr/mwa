FROM node:11.4.0

# install dependencies
WORKDIR /opt/app
COPY package.json package-lock.json* ./
RUN npm cache clean --force && npm install

# copy app source to image _after_ npm install so that
# application code changes don't bust the docker cache of npm install step
COPY . /opt/app

ENV PORT 3000
EXPOSE 3000

CMD [ "npm", "run", "start" ]