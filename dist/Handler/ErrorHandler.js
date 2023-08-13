"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseVo_1 = require("../Vo/BaseVo");
exports.default = (error, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    if (error?.status) {
        res.send(error || "error");
        return;
    }
    error = BaseVo_1.ErrorVo.convert(error);
    res.send(error || "error");
};
//# sourceMappingURL=ErrorHandler.js.map