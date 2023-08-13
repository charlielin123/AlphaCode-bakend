"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appSetup_1 = __importDefault(require("./startup/appSetup "));
const routerStartup_1 = __importDefault(require("./startup/routerStartup"));
const app = (0, express_1.default)();
(0, appSetup_1.default)(app);
app.use("/api", (req, res) => {
    res.send('fuck');
});
app.use(routerStartup_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map