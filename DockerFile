FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Add package file
COPY package*.json ./

# Install deps
RUN yarn install

# Copy source
COPY . .

# Build dist
RUN yarn run build

# Expose port
EXPOSE ${PORT}

CMD yarn run dev