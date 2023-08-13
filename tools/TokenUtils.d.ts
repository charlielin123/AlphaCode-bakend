import pkg from "jsonwebtoken";
declare function generateToken(payload: object, secretKey: string, expiresIn: string): string;
declare function verifyToken(token: string, secretKey: string): string | pkg.JwtPayload;
declare const _default: {
    generateToken: typeof generateToken;
    verifyToken: typeof verifyToken;
};
export default _default;
