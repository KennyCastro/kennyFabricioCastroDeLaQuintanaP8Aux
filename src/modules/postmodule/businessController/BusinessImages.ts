import ImageModel, { IImage } from "../models/Image";
class BusinessImage {
  constructor() {}

  public async createImage(Image: IImage) {
    try {
      let ImageDb = new ImageModel(Image);
      let result = await ImageDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }

  public async readImage(): Promise<Array<IImage>>;
  ///esta me devuelve solo un usuario
  public async readImage(name: string): Promise<IImage>;
  public async readImage(parametro1?: string) {
    if (parametro1 && typeof parametro1 == "string") {
      //si es que existe quiere decir que solo devolveremos una imagen
      let result: IImage = await ImageModel.findOne({ filename: parametro1 });
      return result;
    } else {
      let listImage: Array<IImage> = await ImageModel.find();
      return listImage;
    }
  }
}
export default BusinessImage;
