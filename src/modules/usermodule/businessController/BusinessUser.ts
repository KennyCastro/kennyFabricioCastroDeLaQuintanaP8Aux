import UsersModel, { IUser } from "../models/Users";
import PostModel, { IPost } from "../../postmodule/models/Post";
class BusinessUser {
  constructor() {}
  //addUsers
  //CRUD
  public async addUsers(user: IUser) {
    try {
      let userDb = new UsersModel(user);
      let result = await userDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }

  ///esta es la sobre carga para toda una la lista de usurios (sin parametros)
  public async readUsers(): Promise<Array<IUser>>;
  ///esta me devuelve solo un usuario
  public async readUsers(id: string): Promise<IUser>;
  //implementacion de la funcion
  public async readUsers(parametro1?: string): Promise<Array<IUser> | IUser> {
    //aqui preguntamos si parametro1 existe y si es de tipo string
    if (parametro1 && typeof parametro1 == "string") {
      //si es que existe quiere decir que solo devolveremos un usuario
      let result: IUser = await UsersModel.findOne({ username: parametro1 });
      return result;
    } else {
      let listUser: Array<IUser> = await UsersModel.find();
      return listUser;
    }
  }

  public async updateUsers(id: string, user: any) {
    let result = await UsersModel.update({ _id: id }, { $set: user });
    return result;
  }
  public async deleteUsers(id: string) {
    let result = await UsersModel.remove({ _id: id });
    return result;
  }

  //---- PARA POST ----
  public async addPost(idUs: string, idPost: string) {
    //en el del inge esta con string y da pero a mi no me da
    let user = await UsersModel.findOne({ _id: idUs });
    if (user != null) {
      var post = await PostModel.findOne({ _id: idPost });
      if (post != null) {
        user.post.push(post);
        return await user.save();
      }
      return null;
    }
    return null;
  }
  public async removePost(idUs: string, idPost: string) {
    let user = await UsersModel.findOne({ _id: idUs });
    var post = await PostModel.findOne({ _id: idPost });
    if (user != null && post != null) {
      let newposts: Array<IPost> = user.post.filter((item: IPost) => {
        if (item.title == post.title) {
          return false;
        }
        return true;
      });
      user.post = newposts;
      try {
        return await user.save();
      } catch (err) {
        return err;
      }
    }
    return null;
  }
}
export default BusinessUser;
