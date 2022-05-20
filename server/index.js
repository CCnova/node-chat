import { Server } from 'socket.io';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const httpServer = createServer();
const PORT = process.env.port || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

httpServer.on('request', (req, res) => {
  fs.readFile(path.join(__dirname, '..', '/client', '/index.html'), (err, fileContent) => {
    if (err) throw err;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fileContent);
  });
});

httpServer.listen(PORT);

const connections = [];
const io = new Server(httpServer);

io.on('connection', socket => {
  connections.push(socket);
  console.log(`Connected: ${connections.length} sockets connected`);

  socket.on('disconnect', data => {
    connections.splice(connections.indexOf(socket), 1);
    console.log(`Disconnected: ${connections.length} sockets connected`);
  });

  socket.on('send_message', message => {
    console.log(`Message received: ${message}`);
    io.emit('new_message', { message });
  });
});