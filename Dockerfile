# Dockerfile
# Usamos la imagen oficial de Node.js
FROM node:20-alpine

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install --production

# Copiamos el resto del proyecto
COPY . .

# Build de TypeScript
RUN npm run build

# Exponemos el puerto de la app
EXPOSE 3000

# Comando por defecto
CMD ["node", "dist/main.js"]
