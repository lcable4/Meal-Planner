const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");

const { updateUser, getUser, createUser, getUserById } = require("../db/users");
const { DefaultDeserializer } = require("v8");
function ValidateEmail(input) {
  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (input.value.match(validRegex)) {
    next({
      name: "Valid email",
      message: "Valid email address",
    });
    document.form1.text1.focus();

    return true;
  } else {
    next({
      name: "Invalid email",
      message: "Invalid email address",
    });
    return false;
  }
}
usersRouter.post("/register", async (req, res, next) => {
  const { username, password, email } = req.body;

  try {
    const register = await createUser({ username, password, email });
    if (password.length < 8) {
      next({
        name: "Password too short",
        message: "Password too short",
      });
    }
    if (email) {
    } else {
      next({
        name: "Invalid email",
        message: "Invalid email address",
      });
    }
    const token = jwt.sign(
      {
        id: register.id,
        username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );
    res.send({
      message: "thank you for signing up",
      token,
    });
  } catch (error) {
    if (error.message === "Username already taken") {
      return res.status(400).send({ message: "Username already taken" });
    } else if (error.message === "Password too short") {
      return res.status(400).send({ message: "Password too short" });
    } else if (error.message === "Email is not valid") {
      return res.status(400).send({ message: "Email is not valid" });
    } else {
      console.log(error);
      return res.status(500).send({ message: "Error creating user" });
    }
  }
});

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUser({ username, password });

    if (user) {
      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        JWT_SECRET
      );

      res.send({ message: "You are logged in!", token });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or Password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.get("/me", async (req, res, next) => {
  try {
    if (req.user) res.send(req.user);
    else
      next({
        name: "No Auth",
        message: "You must be logged in to perform this action",
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.patch("/", async (req, res, next) => {
  try {
    if (req.user) {
      let userId = req.user.id;
      const updatedUser = await updateUser({ userId, ...req.body });
      res.send(updatedUser);
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = usersRouter;
