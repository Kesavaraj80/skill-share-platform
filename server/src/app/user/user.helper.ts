import jwt from "jsonwebtoken";

export interface AccessToken {
  userId: string;
  email: string;
}

export function signAccessToken(payload: AccessToken) {
  return jwt.sign(payload, "njkngfnjglndlfldnlvdslk", {
    expiresIn: "8h",
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, "njkngfnjglndlfldnlvdslk") as AccessToken;
}
