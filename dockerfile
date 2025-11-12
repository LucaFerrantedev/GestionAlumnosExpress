# ------------------------------------
# STAGE 1: Build Image (Instalar dependencias)
# ------------------------------------
FROM node:20-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de manifiesto e instala dependencias
# Usa NPM ci para builds más rápidos y fiables
COPY package.json package-lock.json ./
RUN npm ci

# Copia el resto de los archivos
COPY . .

# ------------------------------------
# STAGE 2: Production Image
# ------------------------------------
FROM node:20-alpine

WORKDIR /app

# Copia solo los node_modules y el código necesario desde el stage 'builder'
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/start.js .
COPY --from=builder /app/.env.example .

# Puerto que el contenedor va a exponer (APP_PORT=3000 según .env.example)
EXPOSE 3000

# Comando para iniciar la aplicación (usa el script 'dev' que llama a start.js)
CMD ["npm", "run", "dev"]