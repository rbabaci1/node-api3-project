const { getById: getUserById } = require("../users/userDb");
const { getById: getPostById } = require("../posts/postDb");

async function validateUserId(req, res, next) {
  console.log(req.baseUrl);
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (user) {
      req.user = user;
      next();
    } else {
      next({
        status: 404,
        message: "The user with the specified ID does not exist.",
      });
    }
  } catch (err) {
    next({
      status: 500,
      error: "The user info could not be retrieved at this moment.",
      reason: err.message,
    });
  }
}

async function validatePostId(req, res, next) {
  try {
    console.log(req.baseUrl);
    const { id } = req.params;
    const post = await getPostById(id);

    if (post) {
      req.post = post;
      next();
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch (err) {
    next({
      status: 500,
      error: "The post info could not be retrieved at this moment.",
      reason: err.message,
    });
  }
}

function validateUser(req, res, next) {
  const body = req.body;

  if (typeof body === undefined) {
    res.status(400).json({ message: "The user data is missing." });
  } else if (!body.hasOwnProperty("name")) {
    res.status(400).json({ message: "The user name is missing." });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  const body = req.body;

  if (typeof body === undefined) {
    res.status(400).json({ message: "The post data is missing." });
  } else if (!body.hasOwnProperty("text")) {
    res.status(400).json({ message: "The post text is missing." });
  } else {
    next();
  }
}

module.exports = { validateUserId, validatePostId, validateUser, validatePost };
