"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPassport = void 0;
const passport_google_oauth2_1 = require("passport-google-oauth2");
const passport_1 = __importDefault(require("passport"));
const UserModel_1 = require("../Models/UserModel");
const initPassport = () => {
    passport_1.default.use(new passport_google_oauth2_1.Strategy({
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK,
        scope: ["email", "profile"],
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(accessToken, refreshToken);
        // console.log(profile);
        const member = await UserModel_1.UserModel.findOrCreate(profile);
        done(null, member);
    }));
};
exports.initPassport = initPassport;
//# sourceMappingURL=Auth.js.map