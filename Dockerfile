# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /BlogMitra

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Expose app port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
