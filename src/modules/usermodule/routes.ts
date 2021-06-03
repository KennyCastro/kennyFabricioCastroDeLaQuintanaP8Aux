import RoutesController from "./routeController/RoutesController";
import RoutesControllerP from "../postmodule/routeController/RoutesController";
import { Express } from "express";
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
    app
      .route(`${this.routeparent}/users`)
      .post(this.routesController.createUsers);

    app.route(`${this.routeparent}/users`).get(this.routesController.getUsers);

    app
      .route(`${this.routeparent}/users/:id`)
      .put(this.routesController.updateUsers);

    app
      .route(`${this.routeparent}/users/:id`)
      .delete(this.routesController.removeUsers);

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
  }
}
export default Routes;
