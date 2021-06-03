import PostModel, { IPost } from "../models/Post";
class BusinessPost {
  constructor() {}
  //addPost
  //CRUD
  public async addPost(post: IPost) {
    let postDb = new PostModel(post);
    let result = await postDb.save();
    return result;
  }
  public async readPost() {
    let listpost: Array<IPost> = await PostModel.find();
    return listpost;
  }
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
