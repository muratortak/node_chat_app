const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');

const{generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socket(server);
var users = new Users();


app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');
    //specify the data but not mandatory.
//    socket.emit('newEmail', {
//        from: 'mike@exaple.com',
//        text: 'What is going on?',
//        createdAt: 123
//    });

//    socket.emit('newMessage', {
//         from: 'john@exaple.com',
//         text: 'See you then',
//         createdAt: Date().toString()
//    });

    // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat Room'));
    // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));
    
    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){

            //return statement to stop the execution in case of invalid input
            return callback('Name and room name are required.');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        //socket.leave('TheRoomName');

        // io.emit => emit to every single connected user
        // socket.boradcast.emit => send the message to everyone connected to the socket server except for the current user
        // socket.emit => Emit one event specificly to one user

        // emit to everyone connected to the room
        // io.emit -> io.to('TheRoomName').emit
        // send everyone in the room expect the user
        // socket.broadcast.to('TheRoomName').emit

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat Room'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

        callback();
    });

    //socket.emit to emit a message to the user who joined
    // socket.emit('newMessage', {
    //     from: 'Admin',
    //     text: 'Welcome to the Chat Room',
    //     createAt: new Date().getTime()
    // });

    //For every other user except for who just joined

    // socket.broadcast.emit('newMessage', {
    //     from: 'Admin',
    //     text: 'New user joined',
    //     createdAt: new Date().getTime()
    // })


   socket.on('createMessage', (message, callback) => {
    // console.log('createMessage', message);
    //This will allow the other tabs on the browser to get the message as well.

    //io is the group of all sockets
    //socket represents a single socket connection
    var user = users.getUser(socket.id);

    if(user && isRealString(message.text)) {
        io.to(user.roomName).emit('newMessage', generateMessage(user.name, message.text));
    }

    callback();

    //sends to all users except the sender
    // socket.broadcast.emit('newMessage', {
    //     from: message.from,
    //     text: message.text,
    //     createdAt: new Date().getTime() 
    // });

   });

   socket.on('createLocationMessage', (coords) => {
       var user = users.getUser(socket.id);
       if(user){
            io.to(user.roomName).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
       }
})
   socket.on('createEmail', (newEmail) => {
        console.log('createEmail', newEmail);
   });
   

    socket.on('disconnect', () => {
        console.log('User was disconnected');
        var user = users.removeUser(socket.id);

        if(user) {
            io.to(user.roomName).emit('updateUserList', users.getUserList(user.roomName));
            io.to(user.roomName).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
            
        }
     });
}); 

server.listen(3000, () => {
    console.log(`server is up on ${port}`);
});









