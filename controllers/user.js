const User = require("../models/user");

module.exports.deleteUser = (req, res, next) => {
  const { userId } = req.body;
  User.findOne({ _id: userId })
    .then(user => {
      if (user) {
        return user.remove();
      } else {
        return res.status(404).json({ message: "User Not Found" });
      }
    })
    .then(sucess => {
      if (sucess) {
        res.status(200).json({ message: "Succesful delete" });
      }
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { userId, role } = req;
  const userToUpdate = req.body.id;
  const updatedUserInfo = req.body.user;
  User.findOne({ _id: userToUpdate }).then(user => {
    if (user) {
      if (user._id.toString() === userId || role === "admin") {
        user
          .updateOne(updatedUserInfo)
          .then(sucess => {
            console.log("Succesfully updated");
          })
          .catch(err => console.log(err));
      } else {
        const error = new Error("Not authorized.");
        error.statusCode = 403;
        error.message = "Not authorized.";
        next(error);
      }
    }
  });
};

module.exports.getUser = (req, res, next) => {
  const requestedUserId = req.params.id;
  console.log("[params.id] ", requestedUserId);
  User.findOne({ _id: requestedUserId }).then(user => {
    if (user) {
      const { role, email, name, department } = user;
      res.status(200).json({ role, email, name, department });
    } else {
      console.log("No User found");
    }
  });
};

module.exports.getUsers = (req, res, next) => {
  User.find().then(users => {
    if (users) {
      res.status(200).json(users);
    } else {
      console.log("No User found");
    }
  });
};
