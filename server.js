require("dotenv").config();

const PORT = 3000;
const express = require("express");
const server = express();
const morgan = require("morgan");
const cors = require("cors");

server.use(morgan("dev"));
server.use(express.json());
server.use(cors());

const apiRouter = require("./api");
server.use("/api", apiRouter);

// 404 handler
server.get("*", (req, res) => {
  res.status(404).send({
    name: "404 - Not Found",
    message: "No route found for the requested URL",
  });
});

// error handling middleware
server.use((error, req, res, next) => {
  console.error("SERVER ERROR: ", error);
  if (res.statusCode < 400) res.status(500);
  res.send({ name: error.name, message: error.message });
});

server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});
