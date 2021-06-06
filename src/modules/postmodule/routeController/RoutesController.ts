import { Request, Response } from "express";
import BusinessPost from "../businessController/BusinessPost";
import BusinessImage from "../businessController/BusinessImages";
import sha1 from "sha1";
import { IPost } from "../models/Post";
import { IImage } from "../models/Image";
import isEmpty from "is-empty";
import path from "path";
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

  public async newImage(request: Request, response: Response) {
    /*var id: string = request.params.id;
    if (!id) {
      response
        .status(300)
        .json({ serverResponse: "El id es necesario para subir una foto" });
      return;
    }*/

    //verificamos si el envio de imagenes es vacio o no
    if (isEmpty(request.files)) {
      response
        .status(300)
        .json({ serverResponse: "No existe un archivo adjunto" });
      return;
    }
    /*var post: BusinessPost = new BusinessPost();
    var postToUpdate: IPost = await post.readPost(id);
    if (!postToUpdate) {
      response.status(300).json({ serverResponse: "El post no existe!" });
      return;
    }*/
    //directorio actual donde esta en el docker:   /opt/app/src/modules/postmodule/routeController
    var relativepath = `${__dirname}/../Images`; //salimos del directorio de docker para ubicarlo en el lugar correcto para guardar la imagen
    var paths = path.resolve(relativepath);
    var files: any = request.files;
    var llave: Array<string> = Object.keys(files); ///sacamos la llave del envio de imagen

    var file: any = files[llave[0]];

    console.log(file);
    //verificamos que solo sea un archivo tipo imagen
    function getFileExtension(filename: string) {
      return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined; //verificamos su extensión
    }

    if (
      getFileExtension(file.name) == "jpg" ||
      getFileExtension(file.name) == "png" ||
      getFileExtension(file.name) == "gif" ||
      getFileExtension(file.name) == "jpeg"
    ) {
      var filenamehash: string = sha1(new Date().toString().substr(0, 4));
      var filenametotal: string = `${filenamehash}-${file.name}`;
      var totalpath = `${paths}/${filenametotal}`;
      //verificamos si se puede almacenar el archivo
      file.mv(totalpath, async (err: any, success: any) => {
        if (err) {
          response
            .status(300)
            .json({ serverResponse: "No se pudo almacenar el archivo" });
          return;
        }
        //------------------------CREANDO LA IMAGEN ----------
        var img: BusinessImage = new BusinessImage();
        var imgs: IImage;
        imgs.path = totalpath;
        imgs.relativepath = relativepath;
        imgs.filename = filenametotal;
        imgs.timestamp = new Date();
        let result = await img.createImage(imgs);
        response.status(201).json({ serverResponse: "Imagen creada" });
        return;
        //--actualizando la uri del post al que queremos almacenar
        /*postToUpdate.image = "/api/getimage/" + id;
        var postResult = await postToUpdate.save();
        response.status(201).json({ serverResponse: "Imagen creada" });
        return;*/
      });
    }
    //response.status(201).json({ serverResponse: "No es imagen" });
  }
}
export default RoutesController;
