import express from "express";
import dotenv from "dotenv";
import { Application } from "express";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import userRoutes from './modules/user/user.route';
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
    console.log("__dirname", __dirname)
    dotenv.config({ path: path.join(__dirname, "../.env") });
    this.addMiddlewares();
    this.app.use(errorHandler);
  }

  private addMiddlewares(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use("/api/user", userRoutes);
    this.app.use(errorHandler);
  }
}

export default new App();