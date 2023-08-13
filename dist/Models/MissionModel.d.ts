/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { Ref, DocumentType } from "@typegoose/typegoose";
import { User } from "./UserModel";
declare class Mission {
    name: string;
    owner: Ref<User>;
    editor: Ref<User>[];
    cardBoxes: Ref<CardBox>[];
    constructor(name: string, owner: Ref<User>);
    static findByUserId: (userId: import("mongoose").Types.ObjectId) => Promise<Omit<import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, Mission> & Omit<Mission & {
        _id: import("mongoose").Types.ObjectId;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, never>[]>;
    addCardBox(this: DocumentType<Mission>, cardBoxName: string): Promise<import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, CardBox> & Omit<CardBox & {
        _id: import("mongoose").Types.ObjectId;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
}
declare class CardBox {
    name: string;
    cards: Ref<Card>[];
    mission: Ref<Mission>;
    addCard(this: DocumentType<CardBox>, cardName: string): Promise<import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, Card> & Omit<Card & {
        _id: import("mongoose").Types.ObjectId;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
}
declare class Card {
    name: string;
    content: string;
    dueDate: Date;
}
declare const MissionModel: import("@typegoose/typegoose").ReturnModelType<typeof Mission, import("@typegoose/typegoose/lib/types").BeAnObject>;
declare const CardBoxModel: import("@typegoose/typegoose").ReturnModelType<typeof CardBox, import("@typegoose/typegoose/lib/types").BeAnObject>;
declare const CardModel: import("@typegoose/typegoose").ReturnModelType<typeof Card, import("@typegoose/typegoose/lib/types").BeAnObject>;
export { MissionModel, CardBoxModel, CardModel, Mission, CardBox, Card };
