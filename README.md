<div align="center">

## node_chat

node_chat is a simple real time chat web app.

It uses web sockets to maintain and manage client and server connection, making possible to share real time messages through different sessions.

</div>

## Installation

### *Step 1: Clone the git repository*

You need to clone the repository to your computer.

Open a terminal in your choosen folder and type `git clone git@github.com:CCnova/node-chat.git`.

### *Step 2: Setup server*

On a terminal, go to the cloned folder, enter the server folder and type `npm install`.

### *Step 3: Run the server*

Still on terminal and on the server folder, type `npm run dev`.

Now open your browser and go to `http://localhost:3001/`, you can start sending messages locally.

## TO-DO

* Implement client using React.
* Create script to setup client and server with one command from root folder.
* Create user authentication.
* Separate sessions through hash number.
* Deploy project to Heroku.
