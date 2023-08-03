import { ErrorVo } from "@/Vo/BaseVo";
import { Request, Response, NextFunction } from "express";
export default (
  error: Error | ErrorVo,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if ((error as ErrorVo)?.status) {
    res.send(error || "error");
  }
  error = ErrorVo.convert(error as Error);
  res.send(error || "error");
};
