# Node.js base
FROM node:24-slim

# python and venv
RUN apt-get update && apt-get install -y python3 python3-venv python3-pip && rm -rf /var/lib/apt/lists/*

# set working directory
WORKDIR /app

# node dependencies
COPY package*.json ./
RUN npm install

# set up python environment
RUN python3 -m venv /app/venv
COPY requirements.txt ./
RUN /app/venv/bin/pip install -r requirements.txt

# copy the rest of the project
COPY . .

# expose REST and MQTT ports
EXPOSE 3000 1883

CMD ["node", "src/index.js"]