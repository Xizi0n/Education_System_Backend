module.exports.createUser = (req, res, next) => {};
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const secret = require("../misc/secret");
const { handleValidationErrors } = require("../util/handleValidationErrors");

module.exports.singInUser = (req, res, next) => {
  const { email, password } = req.body;
  //handleValidationErrors(req);
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        console.log(user);
        loadedUser = user;
        bcrypt.compare(password, user.password).then(success => {
          if (success) {
            const token = jwt.sign(
              {
                email: loadedUser.email,
                userId: loadedUser._id.toString(),
                role: loadedUser.role
              },
              secret,
              { expiresIn: "1h" }
            );
            res.status(200).json({
              token: token,
              userId: loadedUser._id.toString(),
              role: loadedUser.role,
              image: loadedUser.image
            });
          } else {
            console.log("not valid pass");
          }
        });
      } else {
        console.log("user not found");
      }
    })
    .catch();
};

module.exports.signUpUser = (req, res, next) => {
  const { email, name, department, password } = req.body;
  handleValidationErrors(req);
  User.findOne({ email: email })
    .then(user => {
      console.log("USER", user);
      if (user) {
        const error = new Error("Email already exists");
        error.statusCode = 409;
        next(error);
      } else {
        bcrypt
          .hash(password, 12)
          .then(hashedPwd => {
            const user = new User({
              email: email,
              name: name,
              department: department,
              password: hashedPwd
            });
            return user.save();
          })
          .then(user => {
            console.log(user);
          })
          .catch(err => {
            console.log(err);
            next(err);
          });
      }
    })
    .catch(err => {
      const error = new Error("Internal server error");
      error.statusCode = 500;
      next(error);
    });
};
