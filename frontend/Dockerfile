FROM node:20-alpine

# Create app directory
WORKDIR /app

# Global install of a tiny static server
RUN npm install -g serve

# Copy static files
COPY . .

EXPOSE 5173

# Start the static server
CMD ["npm", "run", "dev"] 