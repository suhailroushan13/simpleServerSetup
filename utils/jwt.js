import jwt from "jsonwebtoken";
import config from "config";
let jwtSign = (payload) => {
  try {
    let token = jwt.sign(payload, config.get("JWT_KEY"), { expiresIn: "1h" });
    return token;
  } catch (error) {
    console.log(error);
  }
};

let jwtVerify = (token) => {
  try {
    let verify = jwt.verify(token, config.get("JWT_KEY"));
    return verify;
  } catch (error) {
    console.log(error);
  }
};

export { jwtSign, jwtVerify };
