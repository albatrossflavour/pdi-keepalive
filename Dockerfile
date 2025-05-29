FROM mcr.microsoft.com/playwright:v1.52.0-jammy

# Create app directory
WORKDIR /app

# Copy only what we need
COPY package*.json ./
COPY keepalive.js ./
COPY .env ./

# Install only production deps
RUN npm install --omit=dev

# Entrypoint
CMD ["node", "keepalive.js"]
