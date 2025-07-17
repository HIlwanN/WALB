FROM node:18

# Install git
RUN apt-get update && apt-get install -y git

WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
