// start.js
const importedOpen = require('open');
// ✨ CORRECCIÓN: Asigna la función de apertura, comprobando si está en .default o directamente.
const openBrowser = importedOpen.default || importedOpen; 

const { spawn } = require('child_process');

const serverURL = 'http://localhost:3000/api-docs';
const delayTime = 5000; // 5 segundos de espera

console.log('Iniciando servidor con nodemon...');

// Ejecuta 'nodemon src/index.js'
const server = spawn('npx', ['nodemon', 'src/index.js'], { 
    stdio: 'inherit',
    shell: true 
});

server.on('error', (err) => {
    console.error('Error al iniciar nodemon:', err);
});

// Espera 5 segundos para que el servidor inicie antes de abrir el navegador
setTimeout(() => {
    console.log(`\nEl servidor debería estar corriendo en el puerto 3000.`);
    console.log(`Abriendo la documentación de Swagger en: ${serverURL}`);
    
    // Llamamos a la función ya corregida
    openBrowser(serverURL); 
    
}, delayTime); 

// Maneja la terminación de nodemon
server.on('close', (code) => {
    console.log(`El servidor terminó con código ${code}`);
});