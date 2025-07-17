FROM node:18

# Install git
RUN apt-get update && apt-get install -y git

RUN npm config set registry https://registry.npmjs.org/

WORKDIR /app
COPY . .
RUN npm install

CMD ["npm", "start"]
