# Utiliser l'image de base Node.js
FROM node:latest AS builder
# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /app
# Copier le package.json et le package-lock.json dans le conteneur
COPY package*.json ./
# Copier tous les fichiers de l'application dans le conteneur
COPY . .
# Exposer le port 4200
EXPOSE 4200
# Installer les dépendances
RUN npm install
# Installer les dépendances
RUN npm run build

# Démarrer l'application
CMD ["npm", "start"]

# Étape de production
FROM nginx:1.21.0-alpine
COPY --from=builder /app/dist/your-angular-app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
