class Router {
    static methods = {
        POST: 'POST',
        GET: 'GET',
        DELETE: 'DELETE',
        OPTIONS: 'OPTIONS'
    };

    constructor() {
        this._routes = new Map();

        const createRoute = (method) => {
            return (pathname, ...handlers) => {
                const routeKey = `${method}:${pathname}`;
                this._routes.set(routeKey, {
                    pathname,
                    method,
                    handlers
                });
            };
        };

        this.post = createRoute(Router.methods.POST);
        this.get = createRoute(Router.methods.GET);
        this.delete = createRoute(Router.methods.DELETE);
        this.options = createRoute(Router.methods.OPTIONS);
    }

    get routes() {
        return new Map(this._routes);
    }
}

export default Router;