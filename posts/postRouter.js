const express = require("express");
const { get, getById, update, remove } = require("./postDb");
const { validateId, validateBody } = require("../validations/index");

const router = express.Router();

/******************     Custom Middleware     ******************/
const namePost = (req, res, next) => {
  req.name = "post";
  next();
};

const getPostsHandler = async (req, res) => {
  try {
    const posts = await get();

    res.status(200).json(posts);
  } catch (err) {
    res
      .status(500)
      .json({ error: "The posts list could not be retrieved at this moment." });
  }
};

const getPostByIdHandler = async (req, res) => {
  res.status(200).json(req.item);
};

const removePostHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const postToRemove = await getById(id);

    await remove(id);
    res.status(200).json({ removed_post: postToRemove });
  } catch (err) {
    next({
      message: "The post could not be removed at this moment.",
      reason: err.message,
    });
  }
};

const putPostHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prevPost = req.item;
    const updatedPost = { id: Number(id), ...req.body };

    await update(id, updatedPost);
    res.status(200).json({
      previous_post: prevPost,
      updated_post: updatedPost,
    });
  } catch (err) {
    next({
      message: "The post could not be updated at this moment.",
      reason: err.message,
    });
  }
};
/********************************************************************/

router.get("/", getPostsHandler);
router.get("/:id", namePost, validateId, getPostByIdHandler);

router.delete("/:id", namePost, validateId, removePostHandler);

router.put("/:id", namePost, validateId, validateBody, putPostHandler);

module.exports = router;
