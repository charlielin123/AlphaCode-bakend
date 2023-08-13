"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = exports.CardBox = exports.Mission = exports.CardModel = exports.CardBoxModel = exports.MissionModel = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const UserModel_1 = require("./UserModel");
let Mission = class Mission {
    constructor(name, owner) {
        this.editor = [];
        this.cardBoxes = [];
        this.name = name;
        this.owner = owner;
    }
    async addCardBox(cardBoxName) {
        const CardBox = new CardBoxModel({ name: cardBoxName, mission: this });
        await CardBoxModel.create(CardBox);
        this.cardBoxes.push(CardBox);
        await this.save();
        return CardBox;
    }
};
exports.Mission = Mission;
Mission.findByUserId = async (userId) => {
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
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Mission.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => UserModel_1.User }),
    __metadata("design:type", Object)
], Mission.prototype, "owner", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => UserModel_1.User }),
    __metadata("design:type", Array)
], Mission.prototype, "editor", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => CardBox }),
    __metadata("design:type", Array)
], Mission.prototype, "cardBoxes", void 0);
exports.Mission = Mission = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { timestamps: true } }),
    __metadata("design:paramtypes", [String, Object])
], Mission);
let CardBox = class CardBox {
    constructor() {
        this.cards = [];
    }
    async addCard(cardName) {
        const Card = new CardModel({ name: cardName });
        await CardModel.create(Card);
        this.cards.push(Card);
        await this.save();
        return Card;
    }
};
exports.CardBox = CardBox;
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], CardBox.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => Card }),
    __metadata("design:type", Array)
], CardBox.prototype, "cards", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => Mission }),
    __metadata("design:type", Object)
], CardBox.prototype, "mission", void 0);
exports.CardBox = CardBox = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { timestamps: true } })
], CardBox);
let Card = class Card {
};
exports.Card = Card;
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Card.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Card.prototype, "content", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Date)
], Card.prototype, "dueDate", void 0);
exports.Card = Card = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { timestamps: true } })
], Card);
const MissionModel = (0, typegoose_1.getModelForClass)(Mission);
exports.MissionModel = MissionModel;
const CardBoxModel = (0, typegoose_1.getModelForClass)(CardBox);
exports.CardBoxModel = CardBoxModel;
const CardModel = (0, typegoose_1.getModelForClass)(Card);
exports.CardModel = CardModel;
//# sourceMappingURL=MissionModel.js.map