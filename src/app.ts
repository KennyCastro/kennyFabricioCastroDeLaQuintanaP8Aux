import express, { Express } from "express";
import * as bodyParser from "body-parser";
import UserModules from "./modules/usermodule/init";
import mongoose, { Mongoose } from "mongoose";
class App {
    public app: Express = express();
    public mongooseClient: Mongoose;
    constructor() {
        this.configuration(); this.connectDatabase();
        this.initApp();
    }
    public connectDatabase() {
        let host: string = process.env.DBHOST || "mongodb://172.18.0.3:27017";
        let database: string = process.env.DATABASE || "seminario";
        let connectionString: string = `${host}/${database}`;
        mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        //Eventos
        mongoose.connection.on("error", err => {
            console.log("Connection Fail");
            console.log(err);
        });
        mongoose.connection.on("open", () => {
            console.log("database connection success!");
        });
        this.mongooseClient = mongoose;
    }
    public configuration() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
    public initApp() {
        console.log("LOAD MODULES");
        const userModule = new UserModules("/api", this.app);
    }
}
export default new App();