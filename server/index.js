import { Server } from 'socket.io';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const httpServer = createServer();
const PORT = process.env.port || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

httpServer.on('request', (req, res) => {
  fs.readFile(path.join(__dirname, '/index.html'), (err, fileContent) => {
    if (err) throw err;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fileContent);
  });
});

httpServer.listen(PORT);

const connections = [];
const io = new Server(httpServer);

const messages = {};
io.on('connection', socket => {
  connections.push(socket);
  console.log(`Connected: ${connections.length} sockets connected`);

  // Send stored messages
  io.emit('message_history', messages);

  // User sended a new message
  socket.on('send_message', ({ userName, message }) => {
    console.log(`${userName} sended a new message: ${message}`);
    const previousUserMessages = messages?.[userName] ?? [];
    messages[userName] = [...previousUserMessages, message];
  });

  // Client disconected
  socket.on('disconnect', data => {
    connections.splice(connections.indexOf(socket), 1);
    console.log(`Disconnected: ${connections.length} sockets connected`);
  });

});