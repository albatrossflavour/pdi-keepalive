FROM mcr.microsoft.com/playwright:v1.55.0-jammy

# Create app directory
WORKDIR /app

# Copy files as root first
COPY package*.json ./
COPY keepalive.js ./
COPY .env ./

# Install dependencies and change ownership
RUN npm install --omit=dev && \
    chown -R pwuser:pwuser /app

# Switch to non-root user
USER pwuser

# Entrypoint
CMD ["node", "keepalive.js"]
