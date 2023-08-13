"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodedToken = exports.generateUserToken = void 0;
const TokenUtils_1 = __importDefault(require("../tools/TokenUtils"));
const secretKey = "kjhsdafkhsadf";
const expiresIn = "1h";
// 验证JWT令牌
/**
 *
 * @param {String} token
 * @returns
 */
const decodedToken = (token) => {
    if (!token)
        return null;
    token = token.slice(5);
    // console.log(token)
    return TokenUtils_1.default.verifyToken(token, secretKey);
};
exports.decodedToken = decodedToken;
``;
const generateUserToken = (userInfo) => {
    const token = "bear " + TokenUtils_1.default.generateToken({ ...userInfo }, secretKey, expiresIn);
    return token;
};
exports.generateUserToken = generateUserToken;
//# sourceMappingURL=UserTokenUtils.js.map