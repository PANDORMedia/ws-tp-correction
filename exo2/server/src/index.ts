import { WebSocketServer, WebSocket } from 'ws';
import type { ServerMessage, ClientMessage } from '@shared/types';

const server = new WebSocketServer({ port: 8686 });

const nicks = new Map<WebSocket, string>();

function broadcast(msg: ServerMessage) {
    for (const client of server.clients) {
        client.send(JSON.stringify(msg));
    }
}

function broadcastUserList() {
    const users = Array.from(nicks.values());
    broadcast({ type: 'user-list', users });
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
                broadcast({ type: 'chat', nick, text: msg.text, ts: Date.now() });
                break;
            }
            case 'typing': {
                const nick = nicks.get(socket)!;
                broadcast({ type: 'typing', nick });
                break;
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
