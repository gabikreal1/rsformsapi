import {Inject, Injectable, Logger, NestMiddleware} from '@nestjs/common';

import { app } from 'firebase-admin';
import { SocketWithAuth } from './auth-extensions';


@Injectable()
export class WSAuthGuard implements NestMiddleware{
    private readonly logger = new Logger(WSAuthGuard.name);
    private defaultApp: app.App;
 
    use(socket: SocketWithAuth, next: Function) {
        const token = socket.handshake.headers.authorization || socket.handshake.headers["authorization"];
        if(token != null && token != ''){
            this.defaultApp.auth().verifyIdToken(token.replace('Bearer ',''))
            .then(async decodedToken => {
                socket.userId = decodedToken.uid;
                socket.email = decodedToken.email;
                next();
             }).catch(error => {
                console.error(error);
                next(new Error('FORBIDDEN'));
             })
        }
        else{
            next(new Error('FORBIDDEN'))
        }
    }
}