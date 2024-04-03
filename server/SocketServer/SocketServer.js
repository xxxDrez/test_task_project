import { WebSocketServer } from 'ws';

export default class SocketServer {
    constructor(httpServer) {
        this.socketServer = new WebSocketServer({ server: httpServer });
        this._clients = new Map();

        this.socketServer.on('connection', this.handleSocket);
        this.socketServer.on('error', this.handleError);
    }

    get clients() {
        return new Map(this._clients);
    }

    handleSocket = (socket, request) => {
        this._clients.set(socket._socket.remoteAddress, socket);
        socket.on('close', () => {
            this.removeSocket(socket);
        });
    };

    removeSocket(socket) {
        this._clients.delete(socket._socket.remoteAddress);
    }

    sendToAll(message = {}) {
        for (const client of this._clients.values()) {
            this.sendMessage(client, message);
        }
    }

    sendMessage(client, message = {}) {
        client.send(JSON.stringify(message));
    }

    close() {
        this.socketServer.close();
    }

    handleError(error) {
        console.error('WebSocket Server error:', error);
    }
}