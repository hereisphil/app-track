# 1. Base image
FROM node:lts-trixie-slim

# 2. Set working directory
WORKDIR /app

# 3. Copy dependency files first (better layer caching)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the source
COPY . .

# 6. Build TypeScript
RUN npm run build

# 7. Expose backend port
EXPOSE 5001

# 8. Run compiled JS
CMD ["node", "dist/server.js"]