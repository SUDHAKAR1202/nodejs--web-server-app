const http = require('http');
const fs = require('fs');
const path = require('path');
const Express = require('express');
const app = new Express();

const port = 3000;

const server = http.createServer((req,res) => {
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'home.html' : req.url + '.html');
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    app.use(Express.static(path.join(__dirname, 'images')));

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile(path.join(__dirname, 'public', '404.html'), (error, content) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });

});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
})