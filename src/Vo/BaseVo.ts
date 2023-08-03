class BaseVo {
  status: number = statusNumber.success;
  message: string;
  display: boolean = false;

  constructor(msg?: string, code?: number) {
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
  status = 500;
  error: string = "error";
  constructor(msg: string) {
    super();
    this.message = msg;
  }
  static convert(error: Error) {
    const err = new ErrorVo(error.message);
    err.error = error.name;
    return err;
  }
}

class LoginError extends ErrorVo {
  error = "login error";
  status = 401;
  constructor(msg: string) {
    super(msg);
  }
}

enum statusNumber {
  success = 0,
  loggingError = 2001,
}

export { BaseVo, ErrorVo, LoginError };
