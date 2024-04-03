import WebSocket from 'ws';
import http from 'http';
import url from 'url';
import HttpServer from './HttpServer/HttpServer.js';
import routes from './routes.js';
import SocketServer from './SocketServer/SocketServer.js';

const PORT = process.env.PORT;

const server = new HttpServer();
const socket = new SocketServer(server.httpServer);

server.listen(PORT, () => {
    console.log(`server listen on port ${PORT}`);
    routes(server);
});

export { socket }
