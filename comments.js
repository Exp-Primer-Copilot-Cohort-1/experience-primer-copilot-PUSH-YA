// Create web server
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const comments = [];
const server = http.createServer(function (req, res) {
    const parsedUrl = url.parse(req.url, true);
    const parsedPath = parsedUrl.pathname;
    const query = parsedUrl.query;
    console.log(parsedPath);
    if (parsedPath === '/') {
        fs.readFile('./index.html', function (err, data) {
            if (err) {
                return res.end('404 Not Found');
            }
            res.setHeader('Content-Type', 'text/html');
            res.end(data);
        });
    } else if (parsedPath === '/comments' && req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(comments));
    } else if (parsedPath === '/comments' && req.method === 'POST') {
        let body = '';
        req.on('data', function (chunk) {
            body += chunk;
        });
        req.on('end', function () {
            const comment = JSON.parse(body);
            comments.push(comment);
            res.end('ok');
        });
    } else {
        const ext = path.parse(parsedPath).ext;
        const file = path.parse(parsedPath).base;
        fs.readFile(`.${parsedPath}`, function (err, data) {
            if (err) {
                return res.end('404 Not Found');
            }
            res.setHeader('Content-Type', getContentType(ext));
            res.end(data);
        });
    }
});
server.listen(8080);
function getContentType(ext) {
    switch (ext) {
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        case '.js':
            return 'text/javascript';
        case '.json':
            return 'application/json';
        default:
            return 'text/plain';
    }
}