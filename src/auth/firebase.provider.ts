import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as serviceAccount from './../../rsforms-6e943-firebase-adminsdk-vwaf2-a5673876d7.json';




@Injectable()
export class FirebaseProvider {
  constructor(private readonly configService: ConfigService) {}

  private firebaseApp: admin.app.App;

  provideFirebaseApp(): admin.app.App {

  //If Initialized return the instance 
  if(this.firebaseApp){
    return this.firebaseApp;
  }
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
  };

    // Initialize Firebase app
    
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(firebase_params),
      databaseURL: `https://${firebase_params.projectId}.firebaseio.com`,
      storageBucket: `${firebase_params.projectId}.appspot.com`,
    });

    return this.firebaseApp;
  }
}