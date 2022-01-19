const mongoose = require("mongoose");
const user_rating = require("./../modle/user_rating");
exports.getAll = async (req, res) => {
  try {
    const userData = await user_rating.find();

    res.status(200).json({
      status: "success",
      results: userData.length,
      data: {
        userData,
      },
    });
  } catch (err) {
    console.log("Error : ", err);
  }
};

exports.createOne = async (req, res) => {
  try {
    //console.log(req.body);
    const uid = req.body.uid * 1;
    console.log(uid);
    const userData = await user_rating.findOne({ uid: uid });

    console.log("userData --> ", userData);

    if (userData == null || userData.length == 0) {
      //if user doesn't exist

      console.log("yes");
      const result = await user_rating.create({
        uid: req.body.uid,
        obj_uid: [
          {
            by_uid: req.body.obj_uid,
            ratings: req.body.ratings,
          },
        ],
        avg_rating: req.body.ratings,
        count: 1,
      });

      res.status(200).json({
        status: "Success",
        data: result,
      });
    } else {
      //if user already exist
      //and rated by someone
      let { obj_uid } = userData;

      console.log("objb_uid --> ", obj_uid);
      // ahiya thi tane index madse
      const index = obj_uid.findIndex((data) => {
        return (
          data.by_uid === req.body.obj_uid && data.ratings !== req.body.ratings
        );
      });
      //console.log(index);

      if (index !== -1) {
        let { avg_rating } = userData;
        const { count } = userData;

        const sumOfAllUsers = avg_rating * count;
        const oldRatings = userData.obj_uid[index].ratings;

        const newSumOfAllusers = sumOfAllUsers - oldRatings + req.body.ratings;

        avg_rating = newSumOfAllusers / count;

        userData.obj_uid[index].ratings = req.body.ratings;
        userData.avg_rating = avg_rating;

        // console.log(upd);
        await userData.save();
        //update avg_rating
      } else {
        let { avg_rating } = userData;
        let { count } = userData;

        const sumOfAllUsers = avg_rating * count;

        const newSumOfAllusers = sumOfAllUsers + req.body.ratings;

        count++;

        avg_rating = newSumOfAllusers / count;

        userData.count = count;
        userData.avg_rating = avg_rating;
        userData.obj_uid.push({
          by_uid: req.body.obj_uid,
          ratings: req.body.ratings,
        });
        await userData.save();
        //avg_rating and count will change
      }
    }

    res.status(200).json({
      status: "success",
      message: "Your ratings are rated",
    });
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.getByUid = async (req, res) => {
  const uid = req.body.uid * 1;
  const by_uid = req.body.by_uid * 1;
  const userData = await user_rating.find(
    {
      uid: uid,
      "obj_uid.by_uid": { $eq: by_uid },
    },
    {
      _id: 0,
      obj_uid: { $elemMatch: { by_uid: by_uid } },
    }
  );

  res.status(200).json({
    status: "success",
    message: "Founded",
    result: userData,
  });
};

{
  $group: {
  }
}
