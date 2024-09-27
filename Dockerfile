FROM node:22.4.1-alpine
WORKDIR ./app/FundRaising
COPY .package*.json ./
COPY . .
RUN npm install
RUN npx tsc
WORKDIR .src/apis
RUN npm install
WORKDIR app/FundRaising
RUN npm update
CMD ["npm","start"]