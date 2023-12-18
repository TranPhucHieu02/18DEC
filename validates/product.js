const { body } = require("express-validator");
const message = require("../helper/message");
const util = require("util");

var options = {
  name: {
    min: 10,
    max: 80,
  },
  descritption: {
    min: 10,
    max: 80,
  },
};

module.exports = {
  validator: function () {
    return [
      body(
        "name",
        util.format(
          message.size_string_message,
          "name",
          options.name.min,
          options.name.max
        )
      ).isLength(options.name),
      body(
        "descritption",
        util.format(
          message.size_string_message,
          "descritption",
          options.descritption.min,
          options.descritption.max
        )
      ).isLength(options.name),
      body("price").isNumeric().withMessage("Price là số"),
      body("image").isURL().withMessage("image không đúng định dạng url"),

    ];
  },
};
