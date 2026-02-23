import { WebSocketServer } from 'ws';

const server = new WebSocketServer({ port: 8686});

server.on('connection', (socket, request) => {
    console.log("Socket Connection");

    socket.on("message", (data) => {
        console.log("Message received :", data.toString());
        socket.send(data.toString());
    })


});



console.log("Server ready");
