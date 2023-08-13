"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { sign, verify } = jsonwebtoken_1.default;
// 生成JWT令牌
function generateToken(payload, secretKey, expiresIn) {
    return sign(payload, secretKey, { expiresIn });
}
// 验证JWT令牌
function verifyToken(token, secretKey) {
    return verify(token, secretKey);
}
exports.default = {
    generateToken,
    verifyToken,
};
//# sourceMappingURL=TokenUtils.js.map