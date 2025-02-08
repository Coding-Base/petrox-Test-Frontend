import React, { useState, useEffect, useRef, useCallback } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const username = localStorage.getItem("username") || "Anonymous";
  const ws = useRef(null);
  // const reconnectAttempts = useRef(0); // Reconnection logic is disabled

  const connectWebSocket = useCallback(() => {
    if (ws.current) {
      ws.current.close(); // Close existing WebSocket before reconnecting
    }

    // Ensure this URL matches your Django WebSocket route.
    ws.current = new WebSocket("ws://localhost:8000/ws/test_portal/");

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      // reconnectAttempts.current = 0; // Reset reconnection attempts
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected.");
      setIsConnected(false);

      // The following reconnection logic is now commented out:
      /*
      if (reconnectAttempts.current < 5) {
        setTimeout(() => {
          reconnectAttempts.current += 1;
          console.log(`Reconnecting attempt ${reconnectAttempts.current}...`);
          connectWebSocket(); // Try reconnecting
        }, 3000); // Retry after 3 seconds
      }
      */
    };
  }, []);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connectWebSocket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const payload = { username, message };
      ws.current.send(JSON.stringify(payload));
      setMessage("");
    } else {
      console.warn("WebSocket is not connected. Message not sent.");
    }
  };

  return (
    <div style={styles.chatContainer}>
      <h2 style={styles.header}>Group Chat</h2>
      <div style={styles.status}>
        {isConnected ? (
          <span style={{ color: "green" }}>🟢 Connected</span>
        ) : (
          <span style={{ color: "red" }}>🔴 Disconnected</span>
        )}
      </div>
      <div style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div key={index} style={styles.message}>
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <form style={styles.form} onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
          disabled={!isConnected}
        />
        <button type="submit" style={styles.button} disabled={!isConnected}>
          Send
        </button>
      </form>
    </div>
  );
};

const styles = {
  chatContainer: {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  header: {
    color: "#302AF3",
    textAlign: "center",
  },
  status: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  messagesContainer: {
    height: "300px",
    overflowY: "scroll",
    border: "1px solid #eee",
    padding: "10px",
    marginBottom: "20px",
  },
  message: {
    padding: "5px 0",
    borderBottom: "1px solid #f1f1f1",
  },
  form: {
    display: "flex",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px 0 0 4px",
    fontSize: "16px",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    backgroundColor: "#FFCC00",
    color: "#302AF3",
    borderRadius: "0 4px 4px 0",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Chat;
