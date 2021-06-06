import PostModel, { IPost } from "../models/Post";
class BusinessPost {
  constructor() {}
  //addPost
  //CRUD
  public async createPost(post: IPost) {
    try {
      let postDb = new PostModel(post);
      let result = await postDb.save();
      return result;
    } catch (err) {
      return err;
    }
    /* let postDb = new PostModel(post);
    let result = await postDb.save();
    return result;*/
  }
  ///sobrecarga a la funcion readPost
  ///esta es la sobre carga para toda una la lista de usurios (sin parametros)
  public async readPost(): Promise<Array<IPost>>;
  ///esta me devuelve solo un usuario
  public async readPost(id: string): Promise<IPost>;
  public async readPost(parametro1?: string) {
    if (parametro1 && typeof parametro1 == "string") {
      //si es que existe quiere decir que solo devolveremos un post
      let result: IPost = await PostModel.findOne({ _id: parametro1 });
      return result;
    } else {
      let listpost: Array<IPost> = await PostModel.find();
      return listpost;
    }
  }
  //----
  public async updatePost(id: string, post: any) {
    let result = await PostModel.update({ _id: id }, { $set: post });
    return result;
  }
  public async deletePost(id: string) {
    let result = await PostModel.remove({ _id: id });
    return result;
  }
}
export default BusinessPost;
