import {Inject, Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response} from 'express';
import { app } from 'firebase-admin';
import { FirebaseProvider } from './firebase.provider';

@Injectable()
export class HttpAuthGuard implements NestMiddleware{
    private defaultApp: app.App;

    constructor(private readonly firebaseProvider: FirebaseProvider) {
        this.defaultApp = firebaseProvider.provideFirebaseApp();
    }


    use(req: Request, res: Response, next: Function) {
        const token = req.headers.authorization;

        if(token != null && token != ''){
            this.defaultApp.auth().verifyIdToken(token.replace('Bearer ',''))
            .then(async decodedToken => {
                const user = {
                    id: decodedToken.client_id,
                }
                req['user'] = user;
                next();
             }).catch(error => {
                console.error(error);
                this.accesDenied(req.url,res);
             })
        }
        else{
            this.accesDenied(req.url,res);
            next();
        }

    }
    private accesDenied(url: string, res: Response) {
        res.status(401).json({
            statusCode:401,
            timestamp: new Date().toISOString(),
            path:url,
            message:'Access Denied'
        })
    }


    

}       