import UsersModel, { IUser } from "../models/Users";
class BusinessUser {
  constructor() {}
  //addUsers
  //CRUD
  public async addUsers(user: IUser) {
    let userDb = new UsersModel(user);
    let result = await userDb.save();
    return result;
  }
  public async readUsers() {
    let listUser: Array<IUser> = await UsersModel.find();
    return listUser;
  }
  public async updateUsers(id: string, user: any) {
    let result = await UsersModel.update({ _id: id }, { $set: user });
    return result;
  }
  public async deleteUsers(id: string) {
    let result = await UsersModel.remove({ _id: id });
    return result;
  }
}
export default BusinessUser;
