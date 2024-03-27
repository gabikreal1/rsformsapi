import { IoAdapter } from "@nestjs/platform-socket.io";
import { WSAuthGuard } from "./auth/ws-auth.middleware";
import { INestApplicationContext } from "@nestjs/common";
import { FirebaseProvider } from "./auth/firebase.provider";

export class AuthIoAdapter extends IoAdapter {
  
  constructor(
    private app: INestApplicationContext,
  ) {
    super(app);
  }
    createIOServer(port: number, options?: any): any {
      const server = super.createIOServer(port, options);
      // const firebaseProvider = this.app.get(FirebaseProvider);
      // server.of('jobs').use((socket, next) => {
      //   const wsAuthGuard = new WSAuthGuard(firebaseProvider);
      //   wsAuthGuard.use(socket, next);
      // });
      
      return server;
    }
  }