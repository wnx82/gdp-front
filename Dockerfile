# Utiliser l'image de base Node.js
FROM node:latest

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Copier le package.json et le package-lock.json dans le conteneur
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers de l'application dans le conteneur
COPY . .

# Exposer le port 4200
EXPOSE 4200

# Démarrer l'application
CMD ["npm", "start"]
