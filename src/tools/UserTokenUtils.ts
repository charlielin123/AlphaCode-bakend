import tokenUtils from "../tools/TokenUtils";


const secretKey = "kjhsdafkhsadf";
const expiresIn = "1h";

// 验证JWT令牌
/**
 *
 * @param {String} token
 * @returns 
 */
const decodedToken = (token:string) => {
  if (!token) return null;
  token = token.slice(5);
  // console.log(token)
  return tokenUtils.verifyToken(token, secretKey);
};``
const generateUserToken = (userInfo) => {
  const token =
    "bear " + tokenUtils.generateToken({ ...userInfo}, secretKey, expiresIn);
  return token;
};




export { generateUserToken, decodedToken };
