import { Server } from 'socket.io';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const httpServer = createServer();
const PORT = process.env.port || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const home = (response) => {
  fs.readFile(path.join(__dirname, '/index.html'), (err, fileContent) => {
    if (err) throw err;
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(fileContent);
  });
}

const messagesHistory = (response) => {
  const messages = JSON.parse(fs.readFileSync(databaseJsonPath, 'utf8'));
  response.writeHead(200, { 'Content-Type': 'application/json' });
  console.log('From messages function: ', messages);
  response.end(JSON.stringify(messages));
}

httpServer.on('request', (req, res) => {
  switch (req.url) {
    case '/':
      home(res);
      break;
    case '/api/messages_history':
      messagesHistory(res);
      break;
    default:
      break;
  }
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

io.on('connection', socket => {
  connections.push(socket);
  console.log(`Connected: ${connections.length} sockets connected`);

  // Load messages from database
  const messages = JSON.parse(fs.readFileSync(databaseJsonPath, 'utf8'));

  // User sended a new message
  socket.on('send_message', ({ userName, message }) => {
    console.log(`${userName} sended a new message: ${message}`);
    const previousUserMessages = messages?.[userName] ?? [];
    messages[userName] = [...previousUserMessages, message];

    // Store new messages into database
    fs.writeFile(databaseJsonPath, JSON.stringify(messages), { flag: 'w' }, err => {
      if (err) throw err;
      console.log('Message stored in file succesfully!');
    });

  });

  // Client disconected
  socket.on('disconnect', data => {
    connections.splice(connections.indexOf(socket), 1);
    console.log(`Disconnected: ${connections.length} sockets connected`);
  });

});