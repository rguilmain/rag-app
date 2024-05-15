# Stage 1: Build the React application
FROM node:18-alpine as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:1.24-alpine as server
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]