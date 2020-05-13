const express = require("express");

const { insert: insertPost } = require("../posts/postDb");
const {
  get,
  getById,
  getUserPosts,
  insert: insertUser,
  update,
  remove,
} = require("./userDb");
const { validateId, validateBody } = require("../validations/index");

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
  res.status(200).json(req.item);
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
    const prevUser = req.item;
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
/********************************************************************/

router.get("/", getUsersHandler);
router.get("/:id", validateId, getUserByIdHandler);
router.get("/:id/posts", validateId, getUserPostsHandler);

router.post("/", validateBody, createUserHandler);
router.post("/:id/posts", validateId, validateBody, createPostHandler);

router.delete("/:id", validateId, deleteUserHandler);

router.put("/:id", validateId, validateBody, putUserHandler);

module.exports = router;
