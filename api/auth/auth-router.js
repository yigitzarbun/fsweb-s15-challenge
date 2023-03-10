const router = require("express").Router();
const { JWT_SECRET } = require("../secrets");
const bcrypt = require("bcryptjs");
const bilmecelerRouter = require("../bilmeceler/bilmeceler-router");
const jwt = require("jsonwebtoken");
const usersModel = require("../users/users-model");
const authMd = require("./auth-middleware");
const secrets = require("../secrets");

router.post(
  "/register",
  authMd.userNameValid,
  authMd.passwordValid,
  authMd.userNameTaken,
  async (req, res, next) => {
    //res.end("kayıt olmayı ekleyin, lütfen!");
    /*
    EKLEYİN
    Uçnoktanın işlevselliğine yardımcı olmak için middlewarelar yazabilirsiniz.
    2^8 HASH TURUNU AŞMAYIN!

    1- Yeni bir hesap kaydetmek için istemci "kullanıcı adı" ve "şifre" sağlamalıdır:
      {
        "username": "Captain Marvel", // `users` tablosunda var olmalıdır
        "password": "foobar"          // kaydedilmeden hashlenmelidir
      }

    2- BAŞARILI kayıtta,
      response body `id`, `username` ve `password` içermelidir:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- Request bodyde `username` ya da `password` yoksa BAŞARISIZ kayıtta,
      response body şunu içermelidir: "username ve şifre gereklidir".

    4- Kullanıcı adı alınmışsa BAŞARISIZ kayıtta,
      şu mesajı içermelidir: "username alınmış".
  */
    try {
      const credentials = req.body;
      const hash = bcrypt.hashSync(credentials.password.toString(), 8);
      credentials.password = hash;
      const registeredUser = await usersModel.add(credentials);
      res.status(201).json(registeredUser);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/login",
  authMd.userNameValid,
  authMd.passwordValid,
  authMd.userNameExists,
  (req, res, next) => {
    //res.end("girişi ekleyin, lütfen!");
    /*
    EKLEYİN
    Uçnoktanın işlevselliğine yardımcı olmak için middlewarelar yazabilirsiniz.

    1- Var olan bir kullanıcı giriş yapabilmek için bir `username` ve `password` sağlamalıdır:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- BAŞARILI girişte,
      response body `message` ve `token` içermelidir:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- req body de `username` ya da `password` yoksa BAŞARISIZ giriş,
      şu mesajı içermelidir: "username ve password gereklidir".

    4- "username" db de yoksa ya da "password" yanlışsa BAŞARISIZ giriş,
      şu mesajı içermelidir: "geçersiz kriterler".
  */
    const { username, password } = req.body;
    usersModel
      .findBy({ username })
      .first()
      .then((user) => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({ message: `welcome, ${username}`, token });
        } else {
          res.status(401).json({ message: "geçersiz kriterler" });
        }
      })
      .catch(next);
  }
);

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: "1d",
  };
  return jwt.sign(payload, secrets.JWT_SECRET, options);
}

module.exports = router;
