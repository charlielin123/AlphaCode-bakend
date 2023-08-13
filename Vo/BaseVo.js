"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deniedRes = exports.LoginError = exports.ErrorVo = exports.BaseVo = void 0;
const code_1 = require("../constants/code");
class BaseVo {
    constructor(msg, code) {
        this.status = code_1.STATUSCODE.success;
        this.display = false;
        if (code) {
            this.status = code;
        }
        if (msg) {
            this.message = msg;
        }
    }
    show() {
        this.display = true;
        return this;
    }
}
exports.BaseVo = BaseVo;
class ErrorVo extends BaseVo {
    constructor(msg, code) {
        super(msg, code);
        this.status = code_1.STATUSCODE.knownError;
        this.error = "Error";
    }
    static convert(error) {
        if (error instanceof ErrorVo) {
            return error;
        }
        const err = new ErrorVo(error.message);
        err.error = error.name;
        return err;
    }
}
exports.ErrorVo = ErrorVo;
class LoginError extends ErrorVo {
    constructor(msg) {
        super(msg);
        this.error = "login error";
        this.status = code_1.STATUSCODE.loggingError;
    }
}
exports.LoginError = LoginError;
const deniedRes = new BaseVo("您沒有權限", code_1.STATUSCODE.denied);
exports.deniedRes = deniedRes;
//# sourceMappingURL=BaseVo.js.map