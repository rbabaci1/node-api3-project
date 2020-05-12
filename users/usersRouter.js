const express = require("express");
const {
  get,
  getById,
  getUserPosts,
  insert,
  update,
  remove,
} = require("./userDb");

const router = express.Router();

router.post("/", (req, res) => {
  // do your magic!
});

router.post("/:id/posts", (req, res) => {
  // do your magic!
});

router.get("/", async (req, res) => {
  const users = await get();
  res.status(200).json(users);
});

router.get("/:id", (req, res) => {
  // do your magic!
});

router.get("/:id/posts", (req, res) => {
  // do your magic!
});

router.delete("/:id", (req, res) => {
  // do your magic!
});

router.put("/:id", (req, res) => {
  // do your magic!
});

//custom middleware

async function validateUserId(req, res, next) {
  const { id } = req.params;

  try {
    const user = await getById(id);

    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).json({ message: "Invalid user id." });
    }
  } catch (err) {
    res.status(500).json({ error: "The user info could not be retrieved." });
  }
}

function validateUser(req, res, next) {
  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
