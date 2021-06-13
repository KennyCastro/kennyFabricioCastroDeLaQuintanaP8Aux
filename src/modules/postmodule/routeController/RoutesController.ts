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

  //colocar la uri de la imagen en Image de post para acceder
  public async adduriImage(request: Request, response: Response) {
    var id: string = request.params.id;
    var filename: string = request.params.file;
    if (!id || !filename) {
      response
        .status(300)
        .json({ serverResponse: "Post e imagen son necesarios" });
      return;
    }
    var post: BusinessPost = new BusinessPost();
    var postData: IPost = await post.readPost(id);
    if (!postData) {
      response.status(300).json({ serverResponse: "No se encuentra el post" });
      return;
    }
    var image: BusinessImage = new BusinessImage();
    var img: IImage = await image.readImage(filename);
    if (!img) {
      response
        .status(300)
        .json({ serverResponse: "No se encuentra la imagen" });
      return;
    }
    if (img.path == null) {
      response.status(300).json({ serverResponse: "No existe la imagen " });
      return;
    }
    postData.image = img.relativepath;
    var postResult: IPost = await postData.save();
    return response.status(300).json({ serverResponse: postResult });
    //response.sendFile(img.path);
  }

  //------------------------IMAGES -------
  public async newImage(request: Request, response: Response) {
    //verificamos si el envio de imagenes es vacio o no
    if (isEmpty(request.files)) {
      response
        .status(300)
        .json({ serverResponse: "No existe un archivo adjunto" });
      return;
    }

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
      getFileExtension(file.name) === "jpg" ||
      getFileExtension(file.name) === "png" ||
      getFileExtension(file.name) === "gif" ||
      getFileExtension(file.name) === "jpeg"
    ) {
      console.log(getFileExtension(file.name));
      var filenamehash: string = sha1(Date.now().toString()).substr(0, 7);
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
        var imgs: any = {
          //si pongo de tipo IImagen a imgs me pide mandar o inicializar todos sus metodos, por eso lo puse any
          path: totalpath,
          relativepath: "/api/getImage/" + filenametotal,
          filename: filenametotal,
          timestamp: new Date(),
        };

        let result = await img.createImage(imgs);
        response.status(201).json({ serverResponse: "Imagen creada" });
        return;
      });
    } else {
      response.status(300).json({ serverResponse: "No es imagen" });
      return;
    }
  }

  public async infoImage(request: Request, response: Response) {
    var image: BusinessImage = new BusinessImage();
    const result: Array<IImage> = await image.readImage();
    response.status(200).json({ serverResponse: result });
  }

  public async getImage(request: Request, response: Response) {
    var filename: string = request.params.file;
    try {
      if (!filename) {
        response
          .status(300)
          .json({ serverResponse: "Nombre de imagen no encontrado" });
        return;
      }
      var image: BusinessImage = new BusinessImage();
      var img: IImage = await image.readImage(filename);
      if (!img) {
        response
          .status(300)
          .json({ serverResponse: "Error no existe el nombre solicitado" });
        return;
      }
      if (img.path == null) {
        response.status(300).json({ serverResponse: "No existe la imagen " });
        return;
      }
      response.sendFile(img.path);
      return;
    } catch (err) {
      return response.status(300).json({ serverResponse: "Error " });
    }
  }
}
export default RoutesController;
