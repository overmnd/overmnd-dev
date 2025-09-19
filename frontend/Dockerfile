# Lightweight dev image for Vite
FROM node:20-alpine

WORKDIR /app

# Install deps first for better caching
COPY package.json package-lock.json* ./
# lockfile was out-of-sync earlier; use npm install (not ci) to regenerate if needed
RUN npm install

# Copy source
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
