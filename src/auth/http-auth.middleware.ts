import { Injectable, NestMiddleware} from '@nestjs/common';
import { Response} from 'express';
import { app } from 'firebase-admin';
import { FirebaseProvider } from './firebase.provider';
import { RequestWithAuth } from './auth-extensions';

@Injectable()
export class HttpAuthGuard implements NestMiddleware{
    private defaultApp: app.App;

    constructor(private readonly firebaseProvider: FirebaseProvider) {
        this.defaultApp = firebaseProvider.provideFirebaseApp();
    }

    use(req: RequestWithAuth, res: Response, next: Function) {
        console.log(req);
        const token = req.headers.authorization;

        if(token != null && token != ''){
            this.defaultApp.auth().verifyIdToken(token.replace('Bearer ',''))
            .then(async decodedToken => {
                req.userId = decodedToken.uid;
                req.email = decodedToken.email;
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
            path:url,
            message:'Access Denied'
        })
    }


    

}       