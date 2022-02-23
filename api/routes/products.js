const express = require('express')
const router = express.Router()
const Product = require("../models/product")

/* const auth = require('./../middlewares/verifyToken');
router.use(auth) */

router.get("/", async (req, res, next) => {
  try {
    const data = await Product.find(req.query).sort({sku:-1}).exec();
    res.send( data );
  } catch (error) {
    res.status(400).send(error);
  }
});
router.post("/", async (req, res, next) => {
  try {
    const data = await Product.find(req.body).sort({sku:-1}).exec();
    res.send( data );
  } catch (error) {
    res.status(400).send(error);
  }
});
router.get("/:_id", async (req, res, next) => {
  try {
    const data = await Product.find({_id: req.params._id})
    res.send( data );
  } catch (error) {
    res.status(400).send(error);
  }
});
router.put("/", async (req, res, next) => {
  try {
    if(Array.isArray(req.body)){
      Product.insertMany(req.body).then(i=>{
        res.send( i );
      })
    } else {
      let data = new Product(req.body);
      await data.save();
      res.send( data );
    }
  } catch (error) {
      res.status(400).send(error);
  }
});
router.patch("/:id", async (req, res, next) => {
  try { 
    let data =  req.body
    await Product.updateMany({ _id: req.params.id },data);
    res.send( data );
  } catch (error) {
    res.status(400).send(error);
  }
});
router.delete("/:id", async (req, res, next) => {
  try {
    const data = await Product.deleteMany({ _id: req.params.id });
    res.send( data );
  } catch (error) {
    res.status(400).send(error);
  }
});
router.delete("/", async (req, res, next) => {
  try {
    const data = await Product.deleteMany(req.query);
    res.send( data );
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router