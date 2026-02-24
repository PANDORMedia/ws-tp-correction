import { useState, useEffect, useRef } from 'react';
import './App.css';
import type { ServerMessage, ClientMessage } from '../../shared/types';

function App() {
  const [messages, setMessages] = useState<ServerMessage[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [username, setUsername] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8686');
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const msg: ServerMessage = JSON.parse(event.data);

      if (msg.type === 'user-list') {
        setUsers(msg.users);
      } else {
        setMessages((prev) => [...prev, msg]);
      }
    };

    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (!inputMsg.trim() || !wsRef.current) return;
    const msg: ClientMessage = { type: 'chat', text: inputMsg };
    wsRef.current.send(JSON.stringify(msg));
    setInputMsg('');
  };

  const changeUsername = () => {
    if (!username.trim() || !wsRef.current) return;
    const msg: ClientMessage = { type: 'set-nick', nick: username };
    wsRef.current.send(JSON.stringify(msg));
    setUsername('');
  };

  return (
    <div className="app">
      <div className="sidebar">
        <h3>Users ({users.length})</h3>
        <ul>
          {users.map((user) => (
            <li key={user}>{user}</li>
          ))}
        </ul>
      </div>

      <div className="main">
        <div className="nickname-bar">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="New nickname"
            onKeyDown={(e) => e.key === 'Enter' && changeUsername()}
          />
          <button onClick={changeUsername}>Change nick</button>
        </div>

        <div className="messages">
          {messages.map((msg, i) => {
            if (msg.type === 'chat') {
              return <p key={i}><b>{msg.nick}</b>: {msg.text}</p>;
            }
            if (msg.type === 'system') {
              return <p key={i} className="system">{msg.text}</p>;
            }
            if (msg.type === 'typing') {
              return <p key={i} className="system">{msg.nick} is typing...</p>;
            }
          })}
        </div>

        <div className="chat-bar">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Type a message"
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
