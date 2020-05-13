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
    const { name } = req;
    const data = name === "user" ? await getUsers() : await getPosts();

    res.status(200).json(data);
  } catch (err) {
    next({
      error: `The ${name}s could not be retrieved at this moment.`,
      reason: err.message,
    });
  }
}

async function getByIdHandler(req, res) {
  const { name } = req;

  res.status(200).json(req[name]);
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
    const { name } = req;

    const addedItem =
      name === "user" && req.body.name
        ? await insertUser(req.body)
        : await insertPost({ user_id: id, ...req.body });

    res.status(201).json(addedItem);
  } catch (err) {
    next({
      error: `The ${name} could not be added at this moment.`,
      reason: err.message,
    });
  }
}

async function deleteHandler(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req;

    const itemToRemove =
      name === "user" ? await getUserById(id) : await getPostById(id);

    name === "user" ? await removeUser(id) : await removePost(id);
    res.status(200).json({ [`removed_${name}`]: itemToRemove });
  } catch (err) {
    next({
      error: `The ${name} could not be removed at this moment.`,
      reason: err.message,
    });
  }
}

async function putHandler(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req;
    const previousItem = req[name];
    const updatedItem = { id: Number(id), ...req.body };

    name === "user"
      ? await updateUser(id, updatedItem)
      : await updatePost(id, updatedItem);
    res.status(200).json({
      [`previous_${name}`]: previousItem,
      [`updated_${name}`]: updatedItem,
    });
  } catch (err) {
    next({
      error: `The ${name} could not be updated at this moment.`,
      reason: err.message,
    });
  }
}

async function validateId(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req;

    const item =
      name === "user" ? await getUserById(id) : await getPostById(id);

    if (item) {
      req[name] = item;
      next();
    } else {
      next({
        status: 404,
        message: `The ${name} with the specified ID does not exist.`,
      });
    }
  } catch (err) {
    next({
      error: `The ${name} info could not be retrieved at this moment.`,
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
      message: `Some info in the body is missing or incorrectly defined.`,
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
