require('dotenv').config();
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

//Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

//Routes
app.use(require('./routes/index'));

//Static Content
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'build')));

//Sockets
let people = [];

io.on('connection', socket => {
    let name;
    socket.on('users', (n) => {
        people = n;
    });

   socket.on('connected', async (n) => {
       name = n;
       people.push(n);
       io.emit('users', people);
       socket.broadcast.emit('messages', {name, message: `${name} has join the chatroom`});
   });

    socket.on('message', (name, message) => {
        io.emit('messages', {name, message});
    });

    socket.on('copying', (name) => {
        socket.broadcast.emit('copying', name);
    });

    socket.on('stop_copying', (name) => {
        socket.broadcast.emit('stop_copying', name);
    });

    socket.on('file', (message) => {
        io.emit('file', message);
    });

    socket.on('disconnect', () => {
        people = people.filter((n) => n !== name);
        socket.broadcast.emit('messages', {sever: 'server', message: `${name} has left the chatroom`});
        io.emit('users', people);
    });
});


//server
server.listen(3000, () => {
    console.log('server on port 3000');
});