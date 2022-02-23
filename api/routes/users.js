const express = require('express')
const router = express.Router()
const User = require("../models/user")

/* const auth = require('./../middlewares/verifyToken');
router.use(auth) */

router.get('/',async (req, res, next) => {
  try {
    const data = await User.find(req.query).exec()
    res.send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.get("/:_id",async (req, res, next) => {
  try {
    const data = await User.find(req.params)
    res.send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.put('/', async (req, res, next) => {
  try {
    const data = new User(req.body);
    await data.save();
    res.status(201).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.patch("/:_id", async (req, res, next) => {
  try {
    let data = req.body
    await User.updateMany({ _id: req.params._id }, data);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const data = await User.deleteMany({ _id: req.params.id });
    res.send( data );
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router
