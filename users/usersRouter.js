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

router.post("/", validateUser, async (req, res) => {
  try {
    const addedUser = await insert(req.body);

    res.status(201).json(addedUser);
  } catch (err) {
    res
      .status(500)
      .json({ error: "The user could not be added at this moment." });
  }
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
  try {
    const { id } = req.params;
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
