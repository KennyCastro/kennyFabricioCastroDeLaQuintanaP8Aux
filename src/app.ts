import express, { Express } from "express";
import * as bodyParser from "body-parser";
import UserModules from "./modules/usermodule/init";
import mongoose, { Mongoose } from "mongoose";
import router from "./web/routes";
import FileUpload from "express-fileupload";

class App {
  public app: Express = express();
  public mongooseClient: Mongoose;
  constructor() {
    this.configuration();
    this.connectDatabase();
    this.initApp();
  }
  public connectDatabase() {
    let host: string = "mongodb://172.22.0.3:27017";
    let database: string = process.env.DATABASE || "seminario";
    let connectionString: string = `${host}/${database}`;
    mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    //Eventos
    mongoose.connection.on("error", (err) => {
      console.log("Connection Fail");
      console.log(err);
    });
    mongoose.connection.on("open", () => {
      console.log("database connection success!");
      //console.log("hola a todos");
    });
    this.mongooseClient = mongoose;
  }
  public configuration() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(FileUpload({ limits: { fileSize: 50 * 1024 * 1024 } })); //estblecemos el tamaño de imagen
  }
  public initApp() {
    console.log("LOAD MODULES");
    const userModule = new UserModules("/api", this.app);
    this.app.use("/", router);
  }
}
export default new App();
