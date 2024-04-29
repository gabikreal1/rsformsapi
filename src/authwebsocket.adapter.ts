import { IoAdapter } from "@nestjs/platform-socket.io";
import { WSAuthGuard } from "./auth/ws-auth.middleware";
import { INestApplicationContext } from "@nestjs/common";
import { FirebaseProvider } from "./auth/firebase.provider";
import path from "path";

export class AuthIoAdapter extends IoAdapter {
  
  constructor(
    private app: INestApplicationContext,
  ) {
    super(app);
  }
    createIOServer(port: number, options?: any): any {
      const cors = {origin:true,path:'192.168.1.21'}

      const optionsWithCors = {cors,...options}
      
      const server = super.createIOServer(port,  optionsWithCors,);
      
      
      const firebaseProvider = this.app.get(FirebaseProvider);
      server.of('jobs').use((socket, next) => {
        const wsAuthGuard = new WSAuthGuard(firebaseProvider);
        wsAuthGuard.use(socket, next);
      });
      server.of('companies').use((socket, next) => {
        const wsAuthGuard = new WSAuthGuard(firebaseProvider);
        wsAuthGuard.use(socket, next);
      });
      server.of('services').use((socket, next) => {
        const wsAuthGuard = new WSAuthGuard(firebaseProvider);
        wsAuthGuard.use(socket, next);
      });

      return server;
    }
  }