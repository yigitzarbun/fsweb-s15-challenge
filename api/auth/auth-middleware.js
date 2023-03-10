const usersModel = require("../users/users-model");

const userNameValid = (req, res, next) => {
  const { username } = req.body;
  if (!username) {
    res.status(400).json({ message: "username ve şifre gereklidir" });
  } else {
    next();
  }
};

const passwordValid = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ message: "username ve şifre gereklidir" });
  } else {
    next();
  }
};

const userNameTaken = async (req, res, next) => {
  const { username } = req.body;
  const userNameUnique = await usersModel.findBy({ username }).first();
  if (userNameUnique) {
    res.status(400).json("username alınmış");
  } else {
    next();
  }
};

const userNameExists = async (req, res, next) => {
  const { username } = req.body;
  const userNameUnique = await usersModel.findBy({ username }).first();
  if (!userNameUnique) {
    res.status(400).json("geçersiz kriterler");
  } else {
    next();
  }
};

module.exports = {
  userNameValid,
  passwordValid,
  userNameTaken,
  userNameExists,
};
