import { useState, useEffect } from 'react'
import './App.css'

import socket from './socket/client/app'

function Square({ value, onClick }) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

function App() {
  const [messages, setMessages] = useState([]);
  const [notification, setNotification] = useState([]);
  const [room, setRoom] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("receive-message", (data) => {
      console.log("Message received:", data);
      setMessages((prev) => [...prev, data]);
    });


    socket.on("notification", (data) => {
      setNotification((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive-message");
      socket.off("notification");
    };
  }, []);

  const joinRoom = () => {
    const roomInput = document.getElementById("room");
    const roomValue = roomInput.value;
    if (!roomValue) {
      console.error("Room input is empty");
      return;
    }
    console.log("Room to join:", roomValue);
    socket.emit("join-room", roomValue);

    setRoom(roomValue);
  };

  const sendMessage = () => {
    const messageInput = document.getElementById("message");
    const messageValue = messageInput.value;
    if (!messageValue) {
      console.error("Message input is empty");
      return;
    }
    socket.emit("send-message", { room, messageValue });

  };

  return (
    <>
      <div>
        <div>
          {notification.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
        <h1>Socket IO - Tic Tac Toe</h1>
        <form >
          <input id="room" type="text" />
          <input id="message" type="text" />
        </form>
        <button onClick={joinRoom}>Join Room</button>
        <button onClick={sendMessage}>Send message</button>
      </div>

      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>

    </>
  )
}

export default App
