import {
  getModelForClass,
  prop,
  Ref,
  modelOptions,
  DocumentType,
} from "@typegoose/typegoose";
import { User } from "./UserModel";

@modelOptions({ schemaOptions: { timestamps: true } })
class Mission {
  @prop({ required: true })
  public name: string;

  @prop({ ref: () => User })
  public owner: Ref<User>;

  @prop({ ref: () => User })
  public editor: Ref<User>[] = [];

  @prop({ ref: () => CardBox })
  public cardBoxes: Ref<CardBox>[] = [];

  constructor(name: string, owner: Ref<User>) {
    this.name = name;
    this.owner = owner;
  }

  public static findByUserId = async (
    userId: import("mongoose").Types.ObjectId
  ) => {
    return await MissionModel.find({
      $or: [{ owner: userId }, { editor: userId }],
    }).populate([
      "owner",
      "editor",
      {
        path: "cardBoxes",
        populate: { path: "cards", select: "name" },
      },
    ]);
  };
  public async addCardBox(this: DocumentType<Mission>, cardBoxName: string) {
    const CardBox = new CardBoxModel({ name: cardBoxName, mission: this });
    await CardBoxModel.create(CardBox);
    this.cardBoxes.push(CardBox);
    await this.save();
    return CardBox;
  }
}

@modelOptions({ schemaOptions: { timestamps: true } })
class CardBox {
  @prop({ required: true })
  public name: string;
  @prop({ ref: () => Card })
  public cards: Ref<Card>[] = [];
  @prop({ ref: () => Mission })
  public mission: Ref<Mission>;

  public async addCard(this: DocumentType<CardBox>, cardName: string) {
    const Card = new CardModel({ name: cardName });
    await CardModel.create(Card);
    this.cards.push(Card);
    await this.save();
    return Card;
  }
}

@modelOptions({ schemaOptions: { timestamps: true } })
class Card {
  @prop({ required: true })
  name: string;

  @prop()
  content: string;

  @prop()
  dueDate: Date;
}

const MissionModel = getModelForClass(Mission);
const CardBoxModel = getModelForClass(CardBox);
const CardModel = getModelForClass(Card);
export { MissionModel, CardBoxModel, CardModel, Mission };
