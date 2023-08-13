import { ErrorVo } from "../Vo/BaseVo";
import { Request, Response, NextFunction } from "express";
declare const _default: (error: Error | ErrorVo, req: Request, res: Response, next: NextFunction) => void;
export default _default;
