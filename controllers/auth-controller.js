const db = require("../connection");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
let refreshTokenList = [];
const users = [
  {
    name: "Abduljebar",
    username: "abdul",
    password: "password",
    email: "email@domain.com",
    role: "visitor",
  },
];

const getUsers = async (req, res, next) => {
  res.json(users.filter((user) => user.name === req.user.name));
};

const login = async (req, res, next) => {
  try {
    console.log("req.body : ", req.body);
    const username = req.body.username;

    const user = { name: username };

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokenList.push(refreshToken);
    console.log("stored refresh token", refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (error) {
    res.status(500).send({ error });
  }
};

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null || token == undefined) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

const refreshToken = async (req, res, next) => {
  const token = req.body.token;

  if (token == null || token == undefined) return res.sendStatus(401);
  console.log("res : ", token);
  if (!refreshTokenList.includes(token)) return res.sendStatus(403);
  console.log("res : ", refreshTokenList);
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken });
  });
};

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}

const logout = async (req, res, next) => {
  refreshTokenList = refreshTokenList.filter(
    (token) => token !== req.body.token
  );
  res.sendStatus(204);
};

module.exports = {
  getUsers,
  login,
  authenticateToken,
  refreshToken,
  logout,
};
