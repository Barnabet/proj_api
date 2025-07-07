FROM node:20-alpine

# 1. Workspace
WORKDIR /app

# 2. Install deps (package.json + lock file first for cache)
COPY package*.json ./
RUN npm install

# 3. Copy source
COPY . .

# 4. Expose port & start
EXPOSE 4000
CMD ["npm", "run", "dev"] 