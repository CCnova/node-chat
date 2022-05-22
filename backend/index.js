import { Server } from 'socket.io';
import { httpServer } from './server.js';
import { PORT, DATABASE_JSON_PATH } from './constants.js';
import fs from 'fs';

httpServer.listen(PORT);

const connections = [];
const io = new Server(httpServer);

// Create database json file
if (!fs.existsSync(DATABASE_JSON_PATH)) {
  fs.writeFile(DATABASE_JSON_PATH, '{}', { flag: 'w+' }, err => {
    if (err) throw err;
  });
}

io.on('connection', socket => {
  connections.push(socket);
  console.log(`Connected: ${connections.length} sockets connected`);

  // Load messages from database
  const messages = JSON.parse(fs.readFileSync(DATABASE_JSON_PATH, 'utf8'));

  // User sended a new message
  socket.on('send_message', ({ userName, message }) => {
    console.log(`${userName} sended a new message: ${message}`);
    const previousUserMessages = messages?.[userName] ?? [];
    messages[userName] = [...previousUserMessages, message];

    // Store new messages into database and notify client
    fs.writeFile(DATABASE_JSON_PATH, JSON.stringify(messages), { flag: 'w' }, err => {
      if (err) throw err;
      io.emit('new_message', { userName, message });
      console.log('Message stored in file succesfully!');
    });

  });

  // Client disconected
  socket.on('disconnect', data => {
    connections.splice(connections.indexOf(socket), 1);
    console.log(`Disconnected: ${connections.length} sockets connected`);
  });

});