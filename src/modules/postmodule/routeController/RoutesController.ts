import { Request, Response } from "express";
import BusinessPost from "../businessController/BusinessPost";
import sha1 from "sha1";
import { IPost } from "../models/Post";
class RoutesController {
  constructor() {}
  public async createPost(request: Request, response: Response) {
    var post: BusinessPost = new BusinessPost();
    var postData = request.body;
    postData["createAt"] = new Date();
    postData["updateAt"] = new Date();
    let result = await post.createPost(postData);
    response.status(201).json({ serverResponse: result });
  }
  public async getPost(request: Request, response: Response) {
    var post: BusinessPost = new BusinessPost();
    const result: Array<IPost> = await post.readPost();
    response.status(200).json({ serverResponse: result });
  }
  public async updatePost(request: Request, response: Response) {
    var post: BusinessPost = new BusinessPost();
    let id: string = request.params.id;
    var params = request.body;
    params["updateAt"] = new Date();
    var result = await post.updatePost(id, params);
    response.status(200).json({ serverResponse: result });
  }
  public async removePost(request: Request, response: Response) {
    var post: BusinessPost = new BusinessPost();
    let id: string = request.params.id;
    let result = await post.deletePost(id);
    response.status(200).json({ serverResponse: result });
  }
}
export default RoutesController;
