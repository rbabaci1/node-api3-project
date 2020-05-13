const {
  getById: getUserById,
  get: getUsers,
  insert: insertUser,
  remove: removeUser,
  update: updateUser,
  getUserPosts,
} = require("../users/userDb");
const {
  getById: getPostById,
  get: getPosts,
  insert: insertPost,
  remove: removePost,
  update: updatePost,
} = require("../posts/postDb");

const namePost = (req, res, next) => {
  req.name = "post";
  next();
};

const nameUser = (req, res, next) => {
  req.name = "user";
  next();
};

async function getDataHandler(req, res, next) {
  try {
    const data = req.name === "user" ? await getUsers() : await getPosts();

    res.status(200).json(data);
  } catch (err) {
    next({
      error: `The ${req.name}s could not be retrieved at this moment.`,
      reason: err.message,
    });
  }
}

async function getByIdHandler(req, res) {
  res.status(200).json(req[req.name]);
}

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

async function createHandler(req, res, next) {
  try {
    const { id } = req.params;

    const addedItem =
      req.name === "user" && req.body.name
        ? await insertUser(req.body)
        : await insertPost({ user_id: id, ...req.body });

    res.status(201).json(addedItem);
  } catch (err) {
    next({
      error: `The ${req.name} could not be added at this moment.`,
      reason: err.message,
    });
  }
}

async function deleteHandler(req, res, next) {
  try {
    const { id } = req.params;
    const itemToRemove =
      req.name === "user" ? await getUserById(id) : await getPostById(id);

    req.name === "user" ? await removeUser(id) : await removePost(id);
    res.status(200).json({ [`removed_${req.name}`]: itemToRemove });
  } catch (err) {
    next({
      error: `The ${req.name} could not be removed at this moment.`,
      reason: err.message,
    });
  }
}

async function putHandler(req, res, next) {
  try {
    const { id } = req.params;
    const prevItem = req[req.name];
    const updatedItem = { id: Number(id), ...req.body };

    req.name === "user"
      ? await updateUser(id, updatedItem)
      : await updatePost(id, updatedItem);
    res.status(200).json({
      [`previous_${req.name}`]: prevItem,
      [`updated_${req.name}`]: updatedItem,
    });
  } catch (err) {
    next({
      error: `The ${req.name} could not be updated at this moment.`,
      reason: err.message,
    });
  }
}

async function validateId(req, res, next) {
  try {
    const { id } = req.params;

    const item =
      req.name === "user" ? await getUserById(id) : await getPostById(id);

    if (item) {
      req[req.name] = item;
      next();
    } else {
      next({
        status: 404,
        message: `The ${req.name} with the specified ID does not exist.`,
      });
    }
  } catch (err) {
    next({
      error: `The ${req.name} info could not be retrieved at this moment.`,
      reason: err.message,
    });
  }
}

function validateBody(req, res, next) {
  const { body } = req;

  if (typeof body === undefined) {
    res.status(400).json({ message: `Request body is missing.` });
  } else if (!body.hasOwnProperty("name") && !body.hasOwnProperty("text")) {
    res.status(400).json({
      message: `Some info in the body is missing or not correctly defined.`,
    });
  } else {
    next();
  }
}

module.exports = {
  nameUser,
  namePost,
  getDataHandler,
  getByIdHandler,
  getUserPostsHandler,
  createHandler,
  deleteHandler,
  putHandler,
  validateId,
  validateBody,
};
