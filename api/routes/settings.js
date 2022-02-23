const express = require('express')
const router = express.Router()
const Setting = require("../models/setting")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
/* const auth = require('./../middlewares/verifyToken');
router.use(auth) */

router.post('/auth', async (req, res, next) => {
  try{
    const { username, password } = req.body;
    const user = await Setting.findOne({ user: username });
    if (!user) {
      return res.status(401)
      .send({ error: "Wrong account or password" })
    }
    const isPasswordMatch = bcrypt.compare(password, user.pass);
    if ( user && isPasswordMatch){
      const accessToken = jwt.sign({ _id: user._id, name: user.user }, "shin", {expiresIn: 31557600000});
      return res.status(200).send(accessToken)
    }
  } catch (error) {
    res.status(400).send(error);
  }
})

router.get("/", async (req, res, next) => {
  try {
    const data = await Setting.findOne()
    if(data){
      console.log(123)
    }
    res.send( data );
  } catch (error) {
    res.status(400).send(error);
  }
});
router.put("/", async (req, res, next) => {
  try {
    const c = await Setting.findOne()
    if(c){

    }
    let data = new Setting(req.body);
    await data.save();
    res.send( data );
  } catch (error) {
      res.status(400).send(error);
  }
});
router.patch("/:id", async (req, res, next) => {
  try {
    let data =  req.body
    await Setting.updateMany({ _id: req.params.id }, data);
    res.send( data );
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router