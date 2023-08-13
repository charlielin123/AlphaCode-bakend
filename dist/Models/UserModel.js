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
exports.User = exports.UserModel = void 0;
const typegoose_1 = require("@typegoose/typegoose");
class User {
    static async findOrCreate(user) {
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
exports.User = User;
__decorate([
    (0, typegoose_1.prop)({ required: true, index: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], User.prototype, "googleId", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], User.prototype, "image", void 0);
const UserModel = (0, typegoose_1.getModelForClass)(User);
exports.UserModel = UserModel;
//# sourceMappingURL=UserModel.js.map