FROM node:5.11.1

RUN mkdir /src
WORKDIR /src
ADD app/package.json /src/package.json
ADD app/build.js /src/build.js
RUN npm install

EXPOSE 8000

CMD ["npm", "start"]
