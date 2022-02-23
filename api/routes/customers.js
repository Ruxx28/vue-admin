const express = require('express')
const router = express.Router()
const Customer = require("../models/customer")

/* const auth = require('./../middlewares/verifyToken');
router.use(auth) */

router.get("/", async (req, res, next) => {
  try {
    const data = await Customer.find(req.query).sort({dateCreate:-1}).exec();
    res.send( data );
  } catch (error) {
    res.status(400).send(error);
  }
});
router.post("/", async (req, res, next) => {
  try {
    const data = await Customer.find(req.body).sort({dateCreate:-1}).exec();
    res.send( data );
  } catch (error) {
    res.status(400).send(error);
  }
});
router.get("/:_id", async (req, res, next) => {
  try {
    const data = await Customer.findOne({_id: req.params._id})
    res.send( data );
  } catch (error) {
    res.status(400).send(error);
  }
});
router.put("/", async (req, res, next) => {
  try {
      const data = new Customer(req.body);
      await data.save();
      res.send( data );
  } catch (error) {
      res.status(400).send(error);
  }
});
router.patch("/:id", async (req, res, next) => {
  try {
    let data = req.body
    await Customer.updateMany({ _id: req.params.id }, data);
    res.send( data );
  } catch (error) {
    res.status(400).send(error);
  }
});
router.delete("/:id", async (req, res, next) => {
  try {
    const data = await Customer.deleteMany({ _id: req.params.id });
    res.send( data );
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router