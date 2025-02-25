const createError = require("http-errors");
const User = require("../models/user.model");

module.exports.create = (req, res, next) => {
  const { email, password } = req.body;

  // find user by email
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return next(createError(401, {
          message: "Bad credentials",
          errors: { email: "Invalid email or password" },
        }));
      }

      user.checkPassword(password)
        .then((match) => {
          if (match) {
            req.session.userId = user.id;
            return res.status(201).json(user); 
          } else {
            return next(createError(401, {
              message: "Bad credentials",
              errors: { email: "Invalid email or password" },
            }));
          }
        })
        .catch(next); 
    })
    .catch(next); 
};

module.exports.destroy = (req, res, next) => {
  req.session.destroy();
  res.status(204).send();
};
