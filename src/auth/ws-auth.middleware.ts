import {Inject, Injectable, Logger, NestMiddleware} from '@nestjs/common';


import { Socket } from 'socket.io';
import { app } from 'firebase-admin';
import { FirebaseProvider } from './firebase.provider';
import { log } from 'console';


@Injectable()
export class WSAuthGuard implements NestMiddleware{
    private readonly logger = new Logger(WSAuthGuard.name);
    private defaultApp: app.App;

    constructor(private readonly firebaseProvider: FirebaseProvider) {
        this.defaultApp = firebaseProvider.provideFirebaseApp();
    }
    
    use(socket:Socket, next: Function) {
        const token = socket.handshake.headers.authorization || socket.handshake.headers["authorization"];
        if(token != null && token != ''){
            this.defaultApp.auth().verifyIdToken(token.replace('Bearer ',''))
            .then(async decodedToken => {
                const user = {
                    mail: decodedToken.email,
                    id: decodedToken.uid,
                }
                socket.data['user'] = user;
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