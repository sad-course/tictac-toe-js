const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });

    socket.on("message", (msg) => {
        console.log("Message received:", msg);
        // Echo the message back to the client
        socket.emit("message", `Server received: ${msg}`);
    });

    socket.on("room", (room) => {
        console.log(`User joined room: ${room}`);
        socket.join(room);
        // Notify the user that they have joined the room
        socket.emit("roomJoined", `You have joined room: ${room}`);
    })
});

httpServer.listen(3000);