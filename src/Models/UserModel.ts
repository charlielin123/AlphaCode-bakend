import {
  getModelForClass,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";

class User {
  @prop({ required: true,index: true })
  public email!: string;

  @prop()
  public googleId?: string;

  @prop()
  public name?: string;

  @prop()
  public image?: string;

  public static async findOrCreate(this: ReturnModelType<typeof User>, user) {
    const exist = await this.exists({ email: user.email });
    if (exist) {
      return await this.findOne({ email: user.email }).exec();
    }
    const newUser = new UserModel();
    newUser.email = user.email;
    newUser.name = user.displayName;
    newUser.googleId = user.googleId;
    newUser.image = user.picture;
    return await this.create(newUser);
  }
}

const UserModel = getModelForClass(User);

export { UserModel, User };
