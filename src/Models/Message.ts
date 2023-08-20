import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
  ReturnModelType,
} from "@typegoose/typegoose";
import { User } from "./UserModel";

@modelOptions({ schemaOptions: { timestamps: true } })
class room {
  @prop({ref: () => User,required: true})
  public owner: Ref<User>;

  @prop()
  public name: string;

  @prop( { ref: () => User })
  public users: Ref<User>[] = [];

  @prop({ ref: () => MessageLog })
  public messages: Ref<MessageLog>[] = [];
}

@modelOptions({ schemaOptions: { timestamps: true } })
class MessageLog {
  @prop({ trim: true })
  public message?: string;

  @prop({ ref: () => User })
  public from?: Ref<User>;

  @prop({ ref: () => room })
  public to?: Ref<room>;

  @prop()
  public image?: string;
}

const MessageLogModel = getModelForClass(MessageLog);
const RoomModel = getModelForClass(room);

export { MessageLogModel, MessageLog, RoomModel };
