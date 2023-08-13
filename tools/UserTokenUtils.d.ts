/**
 *
 * @param {String} token
 * @returns
 */
declare const decodedToken: (token: string) => string | import("jsonwebtoken").JwtPayload;
declare const generateUserToken: (userInfo: any) => string;
export { generateUserToken, decodedToken };
