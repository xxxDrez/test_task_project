import http from 'http';
import url from 'url';
import Router from './Router/Router.js';

class HttpServer extends Router {
    constructor(){
        super();
        this.httpServer = http.createServer(this.handleRequest.bind(this));
    }

    handleRequest(request, response) {
        const { pathname } = url.parse(request.url);
        const route = this.routes.get(`${request.method}:${pathname}`);
        
        if (request.method === 'OPTIONS') {
            HttpServer.sendOptionsResponse(response);
            return;
        }

        if (route) {
            this.handleRoute(request, response, route);
        } else {
            HttpServer.sendResponse(response, 404, { value: 'Not found' });
        }
    }

    handleRoute(request, response, route) {
        this.parseRequest(request)
            .then(data => {
                for (const handler of route.handlers) {
                    try {
                        handler({ ...request, ...data }, response);
                    } catch (error) {
                        break;
                    }
                }
            })
            .catch(error => {
                console.error('Error parsing request:', error);
                HttpServer.sendResponse(response, 400, { value: 'Bad request' });
            });
    }

    static sendOptionsResponse(response) {
        HttpServer.sendResponse(response, 200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
    }

    static sendResponse(response, status, json) {
        response.writeHead(status, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        response.end(JSON.stringify(json));
    }

    parseRequest(req) {
        return new Promise((resolve, reject) => {
            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                try {
                    const { query } = url.parse(req.url, true);
                    resolve({
                        body: body ? JSON.parse(body) : {},
                        query: Object.assign({}, query)
                    });
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    listen(port, listeningListener = () => {}) {
        this.httpServer.listen(port, listeningListener);
    }
}

export default HttpServer;