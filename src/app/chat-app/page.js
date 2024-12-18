'use client'

import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:8080");

const Page = () => {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  // ฟังก์ชันสำหรับส่งข้อความ
  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        username: username,
        message: message,
      };
      socket.emit("send_message", messageData);
      setMessage("");
    }
  };

  // ฟังก์ชันสำหรับล็อกอิน
  const login = () => {
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  // รับข้อความจากเซิร์ฟเวอร์
  useEffect(() => {
    // รับข้อความจากเซิร์ฟเวอร์
    const receiveMessage = (data) => {
      setMessageList((prev) => [...prev, data]);
    };
  
    socket.on("receive_message", receiveMessage);
  
    // Cleanup function
    return () => {
      socket.off("receive_message", receiveMessage);
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {!isLoggedIn ? (
        <div>
          <h1>Welcome to Chat App</h1>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <button onClick={login}>Join Chat</button>
        </div>
      ) : (
        <div>
          <h1>React Chat App</h1>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              height: "300px",
              overflowY: "scroll",
            }}
          >
            {messageList.map((msg, index) => (
              <p key={index}>
                <strong>{msg.username}:</strong> {msg.message}
              </p>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            style={{ width: "80%", marginRight: "10px" }}
            className="text-black"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default Page;
