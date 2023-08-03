import { STATUSCODE } from "@/constants/code";
class BaseVo {
  status: STATUSCODE = STATUSCODE.success;
  message: string;
  display: boolean = false;

  constructor(msg?: string, code?: STATUSCODE) {
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

class ErrorVo extends BaseVo {
  status = STATUSCODE.knownError;
  error: string = "Error";
  constructor(msg: string, code?: STATUSCODE) {
    super(msg, code);
  }
  static convert(error: Error) {
    const err = new ErrorVo(error.message);
    err.error = error.name;
    return err;
  }
}

class LoginError extends ErrorVo {
  error = "login error";
  status = STATUSCODE.loggingError;
  constructor(msg: string) {
    super(msg);
  }
}

const deniedRes = new BaseVo("您沒有權限", STATUSCODE.denied);

export { BaseVo, ErrorVo, LoginError, deniedRes };
