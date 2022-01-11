FROM node:14.17.6

ENV HOME /root
WORKDIR /root

COPY . .

RUN npm install

EXPOSE 8000

CMD ["npm", "start"]
