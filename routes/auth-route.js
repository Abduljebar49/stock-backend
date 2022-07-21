const { application } = require("express");
const express = require("express");
const {
  getUsers,
  login,
  authenticateToken,
  refreshToken,
  logout,
} = require("../controllers/auth-controller");

const router = express.Router();

router.get("/users", authenticateToken, getUsers);
router.post("/login", login);
router.post("/token", refreshToken);
router.delete("/logout", logout);

module.exports = {
  routes: router,
};
