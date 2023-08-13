import { STATUSCODE } from "../constants/code";
declare class BaseVo {
    status: STATUSCODE;
    message: string;
    display: boolean;
    constructor(msg?: string, code?: STATUSCODE);
    show(): this;
}
declare class ErrorVo extends BaseVo {
    status: STATUSCODE;
    error: string;
    constructor(msg: string, code?: STATUSCODE);
    static convert(error: Error): ErrorVo;
}
declare class LoginError extends ErrorVo {
    error: string;
    status: STATUSCODE;
    constructor(msg: string);
}
declare const deniedRes: BaseVo;
export { BaseVo, ErrorVo, LoginError, deniedRes };
