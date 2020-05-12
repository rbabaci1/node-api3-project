const express = require("express");
const { get, getById, insert, update, remove } = require("./postDb");

const router = express.Router();

const getPostsHandler = async (req, res) => {
  try {
    const posts = await get();

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "The posts list could not be retrieved." });
  }
};

router.get("/", getPostsHandler);

router.get("/:id", (req, res) => {
  // do your magic!
});

router.delete("/:id", (req, res) => {
  // do your magic!
});

router.put("/:id", (req, res) => {
  // do your magic!
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
}

module.exports = router;
