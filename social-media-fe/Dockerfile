FROM node:16.14.0 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Remove the cross-env NODE_OPTIONS flag from your build script
RUN npm pkg set scripts.build="react-scripts build"

# Build the application
RUN npm run build

# Use nginx to serve the static files
FROM nginx:1.21

# Copy the build output to replace the default nginx contents
COPY --from=build /app/build /usr/share/nginx/html

# Create custom nginx config for port 3000
RUN echo 'server { \
    listen 3000; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]