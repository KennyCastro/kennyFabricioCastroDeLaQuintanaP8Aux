import { Request, Response } from "express";
import BusinessUser from "../businessController/BusinessUser";
import jsonwebtoken from "jsonwebtoken";
import { createToken } from "../createToken";
import sha1 from "sha1";
import { IUser } from "../models/Users";

interface Icredentials {
  email: string;
  password: string;
}

class RoutesController {
  constructor() {}

  //------- LOGIN ------
  public async login(request: Request, response: Response) {
    var credentials: Icredentials = request.body;
    //verificamos si el usuario se decide registrar

    //debe haber el atributo email en el body
    if (credentials.email == undefined) {
      response
        .status(300)
        .json({ serverResponse: "Es necesario el parámetro de email" });
      return;
    }
    //debe haber el atributo password en el body
    if (credentials.password == undefined) {
      response
        .status(300)
        .json({ serverResponse: "Es necesario el parámetro de password" });
      return;
    }
    console.log(
      "email " + credentials.email + "    pass" + credentials.password
    );
    credentials.password = sha1(credentials.password); //ciframos el password para comparar, debido a que mas antes ya ciframos nuestros passwords
    const user: BusinessUser = new BusinessUser();
    let result: Array<IUser> = await user.readUsers(credentials, 0, 1);
    if (result.length == 1) {
      //sus credenciales son correctas
      var loginUser: IUser = result[0];
      const token = createToken(loginUser._id);

      response.status(200).json({
        serverResponse: {
          fullname: loginUser.fullname,
          email: loginUser.email,
          username: loginUser.username,
          password: loginUser.password,
          token,
        },
      });
      return;
    }
    response.status(200).json({ serverResponse: "Credenciales incorrectas" });
  }
  ////--------------------------------------------------------------------------

  public async createUsers(request: Request, response: Response) {
    var user: BusinessUser = new BusinessUser();
    var userData = request.body;
    userData["registerdate"] = new Date();
    userData["password"] = sha1(userData["password"]);
    let result = await user.addUsers(userData);
    const token = createToken(result._id);
    response.status(201).json({ serverResponse: result, token });
  }
  public async getUsers(request: Request, response: Response) {
    var user: BusinessUser = new BusinessUser();
    const result: Array<IUser> = await user.readUsers();
    response.status(200).json({ serverResponse: result });
  }
  public async getProfile(request: Request, response: Response) {
    var user: BusinessUser = new BusinessUser();
    let usernam: string = request.params.username;
    const result: IUser | null = await user.readUsers(usernam);
    response.status(200).json({ serverResponse: result });
  }
  public async updateUsers(request: Request, response: Response) {
    var user: BusinessUser = new BusinessUser();
    let id: string = request.params.id;
    var params = request.body;
    var result = await user.updateUsers(id, params);
    response.status(200).json({ serverResponse: result });
  }
  public async removeUsers(request: Request, response: Response) {
    var user: BusinessUser = new BusinessUser();
    let id: string = request.params.id;
    let result = await user.deleteUsers(id);
    response.status(200).json({ serverResponse: result });
  }

  //----   AÑADIR POST A USUARIOS ----------------
  public async addPost(request: Request, response: Response) {
    let idUs: string = request.params.id;
    let idPost = request.body.idPost;
    if (idUs == null && idPost == null) {
      response.status(300).json({
        serverResponse: "No se definio id de usuario ni el id del post",
      });
      return;
    }
    var user: BusinessUser = new BusinessUser();
    var result = await user.addPost(idUs, idPost);
    if (result == null) {
      response
        .status(300)
        .json({ serverResponse: "El post o usuario no existen" });
      return;
    }
    response.status(200).json({ serverResponse: result });
  }

  public async removeUserPost(request: Request, response: Response) {
    let post: BusinessUser = new BusinessUser();
    let idUs: string = request.params.id;
    let idPost: string = request.body.idPost;
    let result = await post.removePost(idUs, idPost);
    response.status(200).json({ serverResponse: result });
  }
}
export default RoutesController;
