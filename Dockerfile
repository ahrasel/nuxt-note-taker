# Use Node.js 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock* ./

# Install dependencies
RUN npm install -g yarn && yarn install

# Copy all files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port 3000
EXPOSE 3000

# Start the application in development mode
CMD ["yarn", "dev", "--host", "0.0.0.0"]
