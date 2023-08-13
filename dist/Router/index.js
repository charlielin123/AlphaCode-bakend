"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.googleRouter = exports.MemberRouter = exports.DemoRouter = void 0;
const DemoRouter_1 = __importDefault(require("./DemoRouter"));
exports.DemoRouter = DemoRouter_1.default;
const MemberRouter_1 = __importDefault(require("./MemberRouter"));
exports.MemberRouter = MemberRouter_1.default;
const googleRouter_1 = __importDefault(require("./googleRouter"));
exports.googleRouter = googleRouter_1.default;
const AuthRouter_1 = __importDefault(require("./AuthRouter"));
exports.authMiddleware = AuthRouter_1.default;
//# sourceMappingURL=index.js.map