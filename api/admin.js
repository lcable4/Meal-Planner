const express = require("express");
const { getAdmin } = require("../db/admin");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const adminRouter = express.Router();

adminRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.admin);
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getAdmin({ username, password });
    if (user) {
      const token = jwt.sign(
        {
          id: user.id,
          username,
          isAdmin: user.isAdmin,
        },
        JWT_SECRET
      );
      res.send({ message: "You are logged in to admin", token });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or Password is incorrect",
      });
    }
  } catch (e) {
    throw e;
  }
});

adminRouter.post("/auth", async (req, res, next) => {
  if (req.admin) {
    res.send(true);
  } else {
    res.send(false);
  }
});

module.exports = adminRouter;
