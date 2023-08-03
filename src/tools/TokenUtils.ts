import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

// 生成JWT令牌
function generateToken(payload: object, secretKey: string, expiresIn: string) {
  return sign(payload, secretKey, { expiresIn });
}

// 验证JWT令牌
function verifyToken(token: string, secretKey: string) {
  return verify(token, secretKey);
}

export default {
  generateToken,
  verifyToken,
};
