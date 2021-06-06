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
}
export default BusinessImage;
