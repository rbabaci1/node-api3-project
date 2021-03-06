const express = require("express");
const helmet = require("helmet");

const userRouter = require("./users/userRouter");
const postRouter = require("./posts/postRouter");
const server = express();

server.use(express.json());
server.use(logger);
server.use(helmet());

server.use("/api/users", userRouter);
server.use("/api/posts", postRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//logger middleware
function logger(req, res, next) {
  console.log(`
  {
      method: ${req.method},
      url: ${req.url},
      timestamp: ${new Date().toLocaleString()}
  }
  `);
  next();
}

function errorHandler(error, req, res, next) {
  const code = error.status || error.statusCode || 500;

  res.status(code).json(error);
}

server.use(errorHandler);

module.exports = server;
