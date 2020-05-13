const express = require("express");
const {
  get,
  getById,
  getUserPosts,
  insert: insertUser,
  update,
  remove,
} = require("./userDb");
const { insert: insertPost } = require("../posts/postDb");

const router = express.Router();

/******************     Custom Middleware     ******************/
const getUsersHandler = async (req, res, next) => {
  try {
    const users = await get();

    res.status(200).json(users);
  } catch (err) {
    next({
      message: "The users list could not be retrieved at this moment.",
      reason: err.message,
    });
  }
};

const createUserHandler = async (req, res, next) => {
  try {
    const addedUser = await insertUser(req.body);

    res.status(201).json(addedUser);
  } catch (err) {
    next({
      message: "The user could not be added at this moment.",
      reason: err.message,
    });
  }
};

const createPostHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = { ...req.body, user_id: id };
    const addedPost = await insertPost(post);

    res.status(201).json(addedPost);
  } catch (err) {
    next({
      message: "The post could not be added at this moment.",
      reason: err.message,
    });
  }
};

const getUserByIdHandler = (req, res) => {
  res.status(200).json(req.user);
};

const getUserPostsHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const posts = await getUserPosts(id);

    res.status(200).json(posts);
  } catch (err) {
    next({
      message: "The user posts could not be retrieved at this moment.",
      reason: err.message,
    });
  }
};

const deleteUserHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userToRemove = await getById(id);

    await remove(id);
    res.status(200).json({ removed_user: userToRemove });
  } catch (err) {
    next({
      message: "The user could not be removed at this moment.",
      reason: err.message,
    });
  }
};

const putUserHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prevUser = req.user;
    const updatedUser = { id: Number(id), ...req.body };

    await update(id, updatedUser);
    res.status(200).json({
      previous_user: prevUser,
      updated_user: updatedUser,
    });
  } catch (err) {
    next({
      message: "The user could not be updated at this moment.",
      reason: err.message,
    });
  }
};

async function validateUserId(req, res, next) {
  try {
    const { id } = req.params;
    const user = await getById(id);

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
/********************************************************************/

router.get("/", getUsersHandler);
router.get("/:id", validateUserId, getUserByIdHandler);
router.get("/:id/posts", validateUserId, getUserPostsHandler);

router.post("/", validateUser, createUserHandler);
router.post("/:id/posts", validateUserId, validatePost, createPostHandler);

router.delete("/:id", validateUserId, deleteUserHandler);

router.put("/:id", validateUserId, validateUser, putUserHandler);

module.exports = router;
