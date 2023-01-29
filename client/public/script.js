const socket = io('http://localhost:3000');

socket.on('chat-message', socket =>{

    console.log("Hello");
    socket.emit('chat-message', 'Hello world')
})