var jwt = require("jsonwebtoken");
const configs = require("../helper/configs");
var modelUser = require('../models/user');

async function checkLogin(req) {
  try {
    var result = {};
    var token = req.headers.authorization;
    if (!token) {
      return { err: "Vui lòng đăng nhập " };
    }
    if (token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      var userID = await jwt.verify(token, configs.SECRET_KEY);
      return { id: userID.id };
    } else {
      return { err: "Vui lòng đăng nhập" };
    }
  } catch (error) {
    return { err: "Vui lòng đăng nhập" };
  }
}

async function checkRole(req) {
  try {
    var DSRole = ['admin', 'publisher'];
    var user = await modelUser.getOne(req.userID.id);
    console.log(user)
    var role = user.role;
    console.log(role);
    if (!DSRole.includes(role)) {
      return { err: "Bạn không đủ quyền" };
    }
    return { user: user};;
  } catch (error) {
    return { err: "Lỗi máy chủ nội bộ "};
  }
}

module.exports = {
  checkLogin,
  checkRole,
};