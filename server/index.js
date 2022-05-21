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
const databaseJsonPath = path.join(__dirname, 'database.json');

// Create database json file
if (!fs.existsSync(databaseJsonPath)) {
  fs.writeFile(databaseJsonPath, '{}', { flag: 'w+' }, err => {
    if (err) throw err;
  });
}

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

    fs.readFile(path.join(__dirname, 'database.json'), 'utf8', (err, data) => {
      if (err) throw err;
      const storedData = JSON.parse(data);
      const userMessageHistory = storedData[userName] ?? [];
      storedData[userName] = [...userMessageHistory, message];
      fs.writeFile(path.join(__dirname, 'database.json'), JSON.stringify(storedData), { flag: 'w' }, err => {
        if (err) throw err;
        console.log('Message stored in file succesfully!');
      });
    });
  });

  // Client disconected
  socket.on('disconnect', data => {
    connections.splice(connections.indexOf(socket), 1);
    console.log(`Disconnected: ${connections.length} sockets connected`);
  });

});