FROM node:boron

ENV DIR /usr/src/app

RUN mkdir ${DIR}
WORKDIR ${DIR}

COPY package.json ${DIR}
RUN npm install
RUN npm i nodemon -g

EXPOSE 80 1234

CMD [ "npm", "start" ]
