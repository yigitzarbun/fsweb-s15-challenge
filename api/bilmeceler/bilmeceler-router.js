// değişiklik yapmayın
const router = require("express").Router();
const bilmeceler = require("./bilmeceler-data");
const restricted = require("../middleware/restricted");

router.get("/", (req, res) => {
  res.status(200).json(bilmeceler);
});

module.exports = router;
