/* style.css
onst express = require('express');
const path = require('path');
const fs = require('fs');

// server.js
// Backend simple en Node.js + Express para servir y "conectar" todos tus archivos HTML.
// Coloca este archivo en la raíz del proyecto (o ajústalo si lo ubicas en /js).
// Requisitos: npm install express

const app = express();
const PORT = process.env.PORT || 3000;

// Ajusta PUBLIC_DIR según dónde estén tus .html.
// Si pones este archivo en /js, usar el padre para buscar los HTML del proyecto:
const PUBLIC_DIR = path.resolve(__dirname, '..'); // cambiar a __dirname si pones server.js en la raíz

// Servir archivos estáticos (HTML, CSS, JS, imágenes, etc.)
app.use(express.static(PUBLIC_DIR));

// Buscar recursivamente archivos .html dentro de PUBLIC_DIR
function findHtmlFiles(dir, baseDir = dir) {
    const results = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            results.push(...findHtmlFiles(fullPath, baseDir));
        } else if (item.isFile() && path.extname(item.name).toLowerCase() === '.html') {
            // ruta relativa para usar en enlaces
            results.push(path.relative(baseDir, fullPath).replace(/\\/g, '/'));
        }
    }
    return results;
}

// Ruta JSON con la lista de páginas HTML
app.get('/api/pages', (req, res) => {
    try {
        const pages = findHtmlFiles(PUBLIC_DIR);
        res.json({ pages });
    } catch (err) {
        res.status(500).json({ error: 'No se pudieron listar las páginas', details: err.message });
    }
});

// Página de inicio automática que enlaza a todos los HTML encontrados
app.get('/', (req, res) => {
    try {
        const pages = findHtmlFiles(PUBLIC_DIR);
        const links = pages
            .map(p => `<li><a href="/${encodeURI(p)}">${p}</a></li>`)
            .join('\n');
        const html = `<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Inicio - Lista de páginas</title>
    <style>
        body{font-family:Arial,Helvetica,sans-serif;padding:20px}
        ul{line-height:1.8}
    </style>
</head>
<body>
    <h1>Inicio - Páginas disponibles</h1>
    <p>Haz clic en una página para abrirla:</p>
    <ul>
        ${links || '<li>No se encontraron archivos .html</li>'}
    </ul>
</body>
</html>`;
        res.send(html);
    } catch (err) {
        res.status(500).send('Error generando la página de inicio');
    }
});

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    console.log(`Sirviendo archivos estáticos desde: ${PUBLIC_DIR}`);
});
