const express = require("express");
const userRoute = require("./routes/user-route");
const app = express();
require("dotenv").config();
app.use(express.json());
const jwt = require("jsonwebtoken");


let refreshTokenList = [];

app.post("/token", (req, res) => {
  const token = req.body.token;

  if (token == null || token == undefined)
    return res.sendStatus(401);
    console.log("res : ",token)
    if (!refreshTokenList.includes(token)) return res.sendStatus(403);
    console.log("res : ",refreshTokenList);
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({accessToken});
  });
});

app.post("/login", async (req, res, next) => {
  try {
    console.log("req.body : ", req.body);
    const username = req.body.username;

    const user = { name: username };

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokenList.push(refreshToken);
    console.log("stored refresh token",refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.delete('/logout',(req,res)=>{
     refreshTokenList = refreshTokenList.filter(token=> token!==req.body.token);
     res.sendStatus(204);
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}

app.listen(4000, function () {
  console.log("listening on port 4000 ");
});
