FROM node:5.11.1

RUN mkdir /src
WORKDIR /src
ADD app /src/
RUN npm install

EXPOSE 8000

CMD ["npm", "start"]
