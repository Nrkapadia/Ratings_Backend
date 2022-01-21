const express = require("express");
const router = express.Router();
const ratingController = require("./../controll/controller");

router.route("/").get(ratingController.getAll).post(ratingController.createOne);

router.route("/getOne").put(ratingController.getByUid);

module.exports = router;
