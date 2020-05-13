const express = require("express");

const {
  nameUser,
  getDataHandler,
  getByIdHandler,
  getUserPostsHandler,
  createHandler,
  deleteHandler,
  putHandler,
  validateId,
  validateBody,
} = require("../custom_middleware");

const router = express.Router();

router.get("/", nameUser, getDataHandler);
router.get("/:id", nameUser, validateId, getByIdHandler);
router.get("/:id/posts", nameUser, validateId, getUserPostsHandler);

router.post("/", nameUser, validateBody, createHandler);
router.post("/:id/posts", nameUser, validateId, validateBody, createHandler);

router.delete("/:id", nameUser, validateId, deleteHandler);

router.put("/:id", nameUser, validateId, validateBody, putHandler);

module.exports = router;
