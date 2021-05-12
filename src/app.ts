import express from "express";
import http from 'http';
import dotenv from "dotenv";
import { Application } from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import { Server, Socket } from 'socket.io';
import authRoutes from './modules/auth/auth.routes';
import socialRoutes from "./modules/social/social.routes";
import tournamentRoutes from "./modules/tournament/tournament.routes";
import playerRoutes from "./modules/player/player.routes";
import gameRoutes from "./modules/game/game.routes";
import 'module-alias/register';
import errorHandler from "./utils/errorHandler";
import { getTournamentForViewing } from "./modules/tournament/tournament.service";

class App {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.socket = new Server(this.server, {
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"]
      }
    })
    this.configure();
  }

  private readonly app: Application;
  private readonly server;
  private readonly socket: Server;

  start(): void {
    this.server.listen(process.env.PORT, () =>
      console.log('Server is running on port ', process.env.PORT)
    );
  }

  private async configure(): Promise<void> {
    dotenv.config({ path: path.join(__dirname, "../.env") });
    this.addMiddlewares();
    this.addSocket();
  }

  private addSocket(): void {
    global.socket = this.socket;
    global.socket.on('connection', (socket: any) => {
      socket.on('VIEW_TOURNAMENT', (x: any) => {
        getTournamentForViewing(x)
          .then((data) => {
            data ?
              socket.emit('VIEW_TOURNAMENT', data) :
              socket.emit('VIEW_TOURNAMENT', null)
          })
          .catch(e => {
            console.error(e)
          })

      })
    });
  }

  private addMiddlewares(): void {
    this.app.use(cors({ origin: true, credentials: true }));
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/social", socialRoutes);
    this.app.use("/api/tournament", tournamentRoutes);
    this.app.use("/api/player", playerRoutes);
    this.app.use("/api/game", gameRoutes);
    this.app.use(errorHandler);
  }
}

export default new App();