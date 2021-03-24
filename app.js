import express from 'express';
import path from 'path';
import http from 'http';

const app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app).listen(app.get('port'), () => {
    console.log("Express server listening on port " + app.get('port'));
});
const io = require('socket.io').listen(server);

let users = []


io.on('connection',  (socket) => {

    socket.on('connect', ()=>{
        console.log("New connection socket.id : ", socket.id)
    })

    socket.on('disconnect', ()=>{
        console.log("disconnect => nickname : ", socket.nickname)
        const updatedUsers = users.filter(user => user != socket.nickname)
        console.log("updatedUsers : ", updatedUsers)
        users = updatedUsers
        io.emit('userlist', users)
    })

    
    socket.on('nick', (nickname) => {
        console.log("nick => nickname : ", nickname)
        socket.nickname = nickname
        users.push(nickname)

        console.log("server : users : ", users)
        io.emit('userlist', users);
    });

    
    socket.on('chat', (data) => {
        console.log("chat => nickname : ", socket.nickname)
        const d = new Date()
        const ts = d.toLocaleString()
        console.log("ts : ", ts)
        const response = `${ts} : ${socket.nickname} : ${data.message}`
        console.log("rs : ", response)
        io.emit('chat', response)
    });
});
