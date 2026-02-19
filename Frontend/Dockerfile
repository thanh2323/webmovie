# Build Stage
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config template
# Nginx 1.19+ automatically substitutes env vars in templates
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
