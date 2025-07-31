const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const usersSchema = require("../model/users.model");

// GET all users
router.get("/", (req, res) => {
  controller.getData(req, res, usersSchema);
});

// CREATE new user
router.post("/", (req, res) => {
  controller.createData(req, res, usersSchema);
});

// UPDATE user by ID
router.put("/:id", (req, res) => {
  controller.updateData(req, res, usersSchema);
});

// DELETE user by ID
router.delete("/:id", (req, res) => {
  controller.deleteData(req, res, usersSchema);
});

module.exports = router;
