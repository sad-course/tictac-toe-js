import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all origins for development; adjust for production
    }
});

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });

    socket.on("join-room", (room) => {
        console.log(`User joined room: ${room}`);
        socket.join(room);
        io.to(room).emit("notification", `A new user has joined room: ${room}`);
    })

    socket.on("send-message", ({ room, messageValue }) => {
        console.log(`Message to room ${room}: ${messageValue}`);
        // Broadcast the message to the specified room
        io.to(room).emit("receive-message", messageValue);
    });
});

httpServer.listen(8080, () => {
    console.log("Server is listening on port 8080");
});