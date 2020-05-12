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

const getUsersHandler = async (req, res) => {
  try {
    const users = await get();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "The users list could not be retrieved." });
  }
};

router.post("/", (req, res) => {
  // do your magic!
});

router.post("/:id/posts", (req, res) => {
  // do your magic!
});

router.get("/", getUsersHandler);

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
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
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    }
  } catch (err) {
    res.status(500).json({ error: "The user info could not be retrieved." });
  }
}

function validateUser(req, res, next) {
  if (!req.body || req.body === {}) {
    res.status(400).json({ message: "The user data is missing." });
  } else if (!"name" in req.body) {
    res.status(400).json({ message: "The user name is missing." });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
