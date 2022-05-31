const router = require("express").Router();
const { list } = require("./dishes.controller");

router.route("/").get(list);

module.exports = router;
