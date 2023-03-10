const { JWT_SECRET } = require("../secrets");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedJWT) => {
      if (err) {
        res.status(401).json({ message: "token geçersizdir" });
      } else {
        req.userInfo = decodedJWT;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "token gereklidir" });
  }
  next();
  /*
    EKLEYİN

    1- Authorization headerında geçerli token varsa, sıradakini çağırın.

    2- Authorization headerında token yoksa,
      response body şu mesajı içermelidir: "token gereklidir".

    3- Authorization headerında geçersiz veya timeout olmuş token varsa,
	  response body şu mesajı içermelidir: "token geçersizdir".
  */
};
