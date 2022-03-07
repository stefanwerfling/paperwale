import {Application} from 'express';
// eslint-disable-next-line no-duplicate-imports
import express from 'express';
import {useExpressServer} from 'routing-controllers';

/**
 * HttpServer
 */
export class HttpServer {

    /**
     * session secret
     */
    public static SESSION_SECRET = 'pwapi';

    /**
     * server object
     * @private
     */
    private readonly _server: Application;

    /**
     * port
     * server default port
     * @private
     */
    private readonly _port: number = 3000;

    /**
     * constructor
     * @param appInit
     */
    public constructor(appInit: {
        port?: number;
        middleWares?: any;
        routes?: any;
        controllers?: any;
        publicDir?: string | null;
    }) {
        if (appInit.port) {
            this._port = appInit.port;
        }

        this._server = express();

        if (appInit.middleWares) {
            this._middlewares(appInit.middleWares);
        }

        if (appInit.routes) {
            this._routes(appInit.routes);
        }

        if (appInit.controllers) {
            useExpressServer(this._server, {
                controllers: appInit.controllers
            });
        }

        if (appInit.publicDir) {
            this._assets(appInit.publicDir);
        }
    }

    /**
     * _middlewares
     * @param middleWares
     * @private
     */
    private _middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }): void {
        middleWares.forEach((middleWare) => {
            this._server.use(middleWare);
        });
    }

    /**
     * _routes
     * @param routes
     * @private
     */
    private _routes(routes: { forEach: (arg0: (route: any) => void) => void; }): void {
        routes.forEach((route) => {
            this._server.use('/', route.router);
        });
    }

    /**
     * _assets
     * @param publicDir
     * @private
     */
    private _assets(publicDir: string | null): void {
        if (publicDir !== null) {
            this._server.use(express.static(publicDir));
        }
    }

    /**
     * start server listen
     */
    public listen(): void {
        this._server.listen(this._port, () => {
            console.log(`Http-Server listening on the http://localhost:${this._port}`);
        });
    }

}