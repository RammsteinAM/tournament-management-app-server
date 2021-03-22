import express from "express";
import dotenv from "dotenv";
import { Application } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
//import userRoutes from './modules/user/user.routes';
import authRoutes from './modules/auth/auth.routes';
import socialRoutes from "./modules/social/social.routes";
import tournamentRoutes from "./modules/tournament/tournament.routes";
import playerRoutes from "./modules/player/player.routes";
import gameRoutes from "./modules/game/game.routes";
import 'module-alias/register';
import errorHandler from "./utils/errorHandler";

class App {
  constructor() {
    this.app = express();
    this.configure();
  }

  private readonly app: Application;

  start(): void {
    this.app.listen(process.env.PORT, () =>
      console.log('Server is running on port ', process.env.PORT)
    );
  }

  private async configure(): Promise<void> {
    dotenv.config({ path: path.join(__dirname, "../.env") });
    this.addMiddlewares();
  }

  private addMiddlewares(): void {
    this.app.use(cors({origin: true, credentials: true}));
    this.app.use(cookieParser());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    //this.app.use("/api/user", userRoutes);
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/social", socialRoutes);
    this.app.use("/api/tournament", tournamentRoutes);
    this.app.use("/api/player", playerRoutes);
    this.app.use("/api/game", gameRoutes);
    this.app.use(errorHandler);
  }
}

export default new App();