import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import { DIRECTORY_NAME, DATABASE_JSON_PATH } from './constants.js';

const httpServer = createServer();

const home = (response) => {
  fs.readFile(path.join(DIRECTORY_NAME, '/index.html'), (err, fileContent) => {
    if (err) throw err;
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(fileContent);
  });
}

const messagesHistory = (response) => {
  const messages = JSON.parse(fs.readFileSync(DATABASE_JSON_PATH, 'utf8'));
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

export {
  httpServer
};