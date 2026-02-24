import { WebSocketServer, WebSocket } from 'ws';
import type { ServerMessage, ClientMessage } from '@shared/types';

const server = new WebSocketServer({ port: 8686 });
const nicks = new Map<WebSocket, string>();
const rooms = new Map<string, Set<WebSocket>>();

function broadcast(msg: ServerMessage) {
    for (const client of server.clients) {
        client.send(JSON.stringify(msg));
    }
}

function broadcastUserList() {
    const users = Array.from(nicks.values());
    broadcast({ type: 'user-list', users });
}

function joinRoom(ws: WebSocket, room: string) {
  if (!rooms.has(room))
    rooms.set(room, new Set());
  const r = rooms.get(room);
  if(r) r.add(ws);
}

function broadcastToRoom(room: string, msg:ServerMessage) {
  rooms.get(room)?.forEach(c => {
    c.send(JSON.stringify(msg));
  });
}

server.on('connection', (socket: WebSocket) => {
    const defaultNick = 'anon_' + Math.random().toString(36).slice(2, 6);
    nicks.set(socket, defaultNick);

    broadcast({ type: 'system', text: `${defaultNick} joined` });
    broadcastUserList();

    socket.on('message', (data) => {
        const msg: ClientMessage = JSON.parse(data.toString());

        switch (msg.type) {
            case 'set-nick': {
                const oldNick = nicks.get(socket)!;
                nicks.set(socket, msg.nick);
                broadcast({ type: 'system', text: `${oldNick} is now ${msg.nick}` });
                broadcastUserList();
                break;
            }
            case 'chat': {
                const nick = nicks.get(socket)!;
                broadcastToRoom(msg.room, { type: 'chat', nick, text: msg.text, room: msg.room, ts: Date.now() });
                break;
            }
            case 'typing': {
                const nick = nicks.get(socket)!;
                broadcastToRoom(msg.room, { type: 'typing', nick });
                break;
            }
            case 'join-room': {
                if(!rooms.get(msg.room)?.has(socket)) {
                    joinRoom(socket, msg.room);
                }
            }
            case 'leave-room': {
                if(!rooms.get(msg.room)?.has(socket)) {
                    rooms.get(msg.room)?.delete(socket);
                }
            }
        }
    });

    socket.on('close', () => {
        const nick = nicks.get(socket)!;
        nicks.delete(socket);
        broadcast({ type: 'system', text: `${nick} left` });
        broadcastUserList();
    });
});

console.log('Server ready on ws://localhost:8686');
