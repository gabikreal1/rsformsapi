import { Injectable, Logger, NestMiddleware} from '@nestjs/common';

import { app } from 'firebase-admin';
import { SocketWithAuth } from './auth-extensions';
import { FirebaseProvider } from './firebase.provider';


@Injectable()
export class WSAuthGuard implements NestMiddleware{
    private readonly logger = new Logger(WSAuthGuard.name);
    private defaultApp: app.App;
 
    constructor(firebaseprovider: FirebaseProvider){this.defaultApp = firebaseprovider.provideFirebaseApp(); }

    use(socket: SocketWithAuth, next: Function) {
        const token = socket.handshake.headers.authorization || socket.handshake.headers["authorization"];
        if(token != null && token != ''){
            this.logger.log(this.defaultApp.name);

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