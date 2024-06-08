# Build Stage
FROM node:20.11.1-alpine as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm ci
COPY ./ /app/
ARG configuration=production
RUN npm run build -- --output-path=./dist --configuration $configuration
RUN ls -R /app/dist  # List files to verify the build output

# Serve Stage
FROM nginx:stable-alpine
COPY --from=build-stage /app/dist/browser /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
