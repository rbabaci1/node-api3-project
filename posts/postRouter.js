const express = require("express");

const {
  namePost,
  getDataHandler,
  getByIdHandler,
  deleteHandler,
  putHandler,
  validateId,
  validateBody,
} = require("../custom_middleware");

const router = express.Router();

router.get("/", namePost, getDataHandler);
router.get("/:id", namePost, validateId, getByIdHandler);

router.delete("/:id", namePost, validateId, deleteHandler);

router.put("/:id", namePost, validateId, validateBody, putHandler);

module.exports = router;
