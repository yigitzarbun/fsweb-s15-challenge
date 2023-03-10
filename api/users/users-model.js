const db = require("../../data/dbConfig");

async function findAll() {
  const users = await db("users");
  return users;
}

function findBy(filter) {
  const result = db("users").where(filter);
  return result;
}

async function findById(user_id) {
  const user = await db("users").where("id", user_id);
  return user;
}

async function add(user) {
  const userIdArray = await db("users").insert(user);
  const userId = userIdArray[0];
  const newUser = await db("users").where("id", userId).first();
  return newUser;
}

module.exports = {
  findAll,
  findBy,
  findById,
  add,
};
