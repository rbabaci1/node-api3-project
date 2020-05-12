const express = require("express");
const usersRouter = require("./users/usersRouter");
const postsRouter = require("./posts/postsRouter");

const server = express();

server.use(express.json());
server.use(logger);

server.use("/api/users", usersRouter);
server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware
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

module.exports = server;
