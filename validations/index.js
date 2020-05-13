const { getById: getUserById } = require("../users/userDb");
const { getById: getPostById } = require("../posts/postDb");

async function validateId(req, res, next) {
  try {
    const { name } = req;
    const { id } = req.params;
    const item =
      name === "user" ? await getUserById(id) : await getPostById(id);

    if (item) {
      req.item = item;
      next();
    } else {
      next({
        status: 404,
        message: `The ${name} with the specified ID does not exist.`,
      });
    }
  } catch (err) {
    next({
      status: 500,
      error: `The ${name} info could not be retrieved at this moment.`,
      reason: err.message,
    });
  }
}

function validateBody(req, res, next) {
  const { body, name } = req;

  if (typeof body === undefined) {
    res.status(400).json({ message: `The ${name} info is missing.` });
  } else if (!body.hasOwnProperty("name") && !body.hasOwnProperty("text")) {
    res.status(400).json({ message: `The ${name} info is missing.` });
  } else {
    next();
  }
}

module.exports = { validateId, validateBody };
