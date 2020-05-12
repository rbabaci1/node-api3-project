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

const getUsersHandler = async (req, res) => {
  try {
    const users = await get();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "The users list could not be retrieved." });
  }
};

const createUserHandler = async (req, res) => {
  try {
    const addedUser = await insertUser(req.body);

    res.status(201).json(addedUser);
  } catch (err) {
    res
      .status(500)
      .json({ error: "The user could not be added at this moment." });
  }
};

const createPostHandler = async (req, res) => {
  const { id } = req.params;
  const post = { ...req.body, user_id: id };

  try {
    const addedPost = await insertPost(post);

    res.status(201).json(addedPost);
  } catch (err) {
    res
      .status(500)
      .json({ error: "The post could not be added at this moment." });
  }
};

const getUserByIdHandler = (req, res) => {
  res.status(200).json(req.user);
};

const getUserPostsHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const posts = await getUserPosts(id);

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      message: "The user posts could not be retrieved at this moment.",
    });
  }
};

const deleteUserHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const userToRemove = await getById(id);
    await remove(id);

    res.status(200).json({ removed_user: userToRemove });
  } catch (err) {
    res
      .status(500)
      .json({ message: "The user could not be removed at this moment." });
  }
};

const putUserHandler = async (req, res) => {
  const { id } = req.params;
  const prevUser = req.user;
  const updatedUser = { id: Number(id), ...req.body };

  try {
    await update(id, updatedUser);

    res.status(200).json({
      previous_user: prevUser,
      updated_user: updatedUser,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "The user could not be updated at this moment." });
  }
};

router.post("/", [validateUser, createUserHandler]);
router.post("/:id/posts", [validateUserId, validatePost, createPostHandler]);
router.get("/", getUsersHandler);
router.get("/:id", [validateUserId, getUserByIdHandler]);
router.get("/:id/posts", [validateUserId, getUserPostsHandler]);
router.delete("/:id", [validateUserId, deleteUserHandler]);
router.put("/:id", [validateUserId, validateUser, putUserHandler]);

//custom middleware
async function validateUserId(req, res, next) {
  const { id } = req.params;

  try {
    const user = await getById(id);

    if (user) {
      req.user = user;
      next();
    } else {
      next(new Error("User does not exists!"));
      // res
      //   .status(404)
      //   .json({ message: "The user with the specified ID does not exist." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "The user info could not be retrieved at this moment." });
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

module.exports = router;
