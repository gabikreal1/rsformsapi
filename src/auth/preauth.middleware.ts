import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response} from 'express';
import * as firebase from 'firebase-admin';
import * as serviceAccount from './rsforms-6e943-firebase-adminsdk-5ecaz-e232ab4ef4.json';
import path from 'path';
import { access } from 'fs';
const firebase_params = {
    type: serviceAccount.type,
    projectId: serviceAccount.project_id,
    privateKeyId: serviceAccount.private_key_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    clientId: serviceAccount.client_id,
    authUri: serviceAccount.auth_uri,
    tokenUri: serviceAccount.token_uri,
    authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
    clientC509CertUrl: serviceAccount.auth_provider_x509_cert_url,
}

@Injectable()
export class PreauthMiddleware implements NestMiddleware{
    private defaultApp: any;

    constructor ( ){
        this.defaultApp = firebase.initializeApp({
            credential: firebase.credential.cert(firebase_params),
            databaseURL: "https://fire-auth-bd895.firebaseio.com"
        });
    }
    use(req: Request, res: Response, next: Function) {
        const token = req.headers.authorization;

        if(token != null && token != ''){
            this.defaultApp.auth().verifyIdToken(token.replace('Bearer ',''))
            .then(async decodedToken => {
                const user = {
                    email:decodedToken.email,
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


    user(req:Request,res: Response, next: Function){
        next();
    }

}       