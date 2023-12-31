var express = require('express');
const { model } = require('mongoose');
const { use } = require('.');
var router = express.Router();
var responseData = require('../helper/responseData');
var modelUser = require('../models/user')
var validate = require('../validates/user')
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const configs = require('../helper/configs');
const { checkLogin,checkRole } = require('../middlewares/protect');

router.post('/register', validate.validator(),
  async function (req, res, next) {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      responseData.responseReturn(res, 400, false, errors.array().map(error => error.msg));
      return;
    }
    var user = await modelUser.getByName(req.body.userName);
    if (user) {
      responseData.responseReturn(res, 404, false, "user da ton tai");
    } else {
      const newUser = await modelUser.createUser({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        role: "user",
      })
      responseData.responseReturn(res, 200, true, newUser);
    }
  });
router.post('/login', async function (req, res, next) {
  var result = await modelUser.login(req.body.userName, req.body.password);
  if(result.err){
    responseData.responseReturn(res, 400, true, result.err);
    return;
  }
  console.log(result);
  var token = result.getJWT();
  res.cookie('tokenJWT',token);
  responseData.responseReturn(res, 200, true, token);
});
router.get('/me',
  async function (req, res, next) {
    try {
      const result = await checkLogin(req);
      if (result.err) {
        responseData.responseReturn(res, 400, true, result.err);
        return;
      }
      console.log(result);
      req.userID = result;
      next();
    } catch (error) {
      console.error(error);
      responseData.responseReturn(res, 500, false, "Lỗi máy chủ nội bộ");
    }
  },
  async function (req, res) {
    try {
      const result = await checkRole(req);
      if (result.err) {
        responseData.responseReturn(res, 403, true, result.err);
      }
      else{
        res.send({ "done": result.user });
      }
    } catch (error) {
      responseData.responseReturn(res, 500, false, "Lỗi máy chủ nội bộ");
    }
  }
);
module.exports = router;