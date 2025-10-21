# Usa una imagen base de Node.js ligera y reciente
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de definición de dependencias
COPY package*.json ./

# Instala las dependencias. Esto es necesario para correr 'npm run dev' con nodemon.
# Instala también las dependencias de producción.
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Exponer el puerto en el que se ejecuta la aplicación (3000 por src/index.js)
EXPOSE 3000

# Comando para iniciar la aplicación en modo desarrollo (usando nodemon)
# El script "dev" usa nodemon para reiniciar automáticamente ante cambios.
CMD [ "npm", "run", "dev" ]