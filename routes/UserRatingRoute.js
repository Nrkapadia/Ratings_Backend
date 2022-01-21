const express = require("express");
const router = express.Router();
const ratingController = require("./../controll/controller");

router.route("/").get(ratingController.getAll).put(ratingController.createOne);

router.route("/getOne").post(ratingController.getByUid);

module.exports = router;
