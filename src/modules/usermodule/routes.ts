import RoutesController from "./routeController/RoutesController";
import RoutesControllerP from "../postmodule/routeController/RoutesController";
import { Express } from "express";
import { security } from "./middleware";
class Routes {
  private routesController: RoutesController;
  private routesControllerP: RoutesControllerP;
  private routeparent: string;
  constructor(routeparent: string, app: Express) {
    this.routesController = new RoutesController();
    this.routesControllerP = new RoutesControllerP();
    this.routeparent = routeparent;
    this.configureRoutes(app);
  }
  private configureRoutes(app: Express) {
    //--------------------USER ROUTES --------------------

    app.route(`${this.routeparent}/login`).post(this.routesController.login);

    app
      .route(`${this.routeparent}/users`)
      .post(this.routesController.createUsers);

    app.route(`${this.routeparent}/users`).get(this.routesController.getUsers);

    app
      .route(`${this.routeparent}/getProfile/:username`)
      .get(security, this.routesController.getProfile);

    app
      .route(`${this.routeparent}/users/:id`)
      .put(this.routesController.updateUsers);

    app
      .route(`${this.routeparent}/users/:id`)
      .delete(this.routesController.removeUsers);

    app
      .route(`${this.routeparent}/addpost/:id`)
      .put(this.routesController.addPost);
    app
      .route(`${this.routeparent}/removepost/:id`)
      .put(this.routesController.removeUserPost);

    //--------------------POST ROUTES --------------------

    app
      .route(`${this.routeparent}/post`)
      .post(this.routesControllerP.createPost);

    app.route(`${this.routeparent}/post`).get(this.routesControllerP.getPost);

    app
      .route(`${this.routeparent}/post/:id`)
      .put(this.routesControllerP.updatePost);

    app
      .route(`${this.routeparent}/post/:id`)
      .delete(this.routesControllerP.removePost);
    //
    app
      .route(`${this.routeparent}/post/:id/:file`) //añadir imagen al post
      .put(this.routesControllerP.adduriImage);
    ///-------------------IMAGES ROUTES ------
    app
      .route(`${this.routeparent}/newimage`)
      .post(this.routesControllerP.newImage); //crear imagen

    app
      .route(`${this.routeparent}/infoImage`)
      .get(this.routesControllerP.infoImage); //sacar info imagen

    app
      .route(`${this.routeparent}/getImage/:file`)
      .get(this.routesControllerP.getImage); //ver imagen
  }
}
export default Routes;
