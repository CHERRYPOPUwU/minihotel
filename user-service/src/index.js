const express = require("express");
const app = express();

app.use(express.json());

let users = [];
let id = 1;

app.post("/users", (req, res) => {
    const user = {
        id: id++,
        name: req.body.name
    };
    users.push(user);
    res.json(user);
});

app.get("/users", (req, res) => {
    res.json(users);
});

app.listen(3001, () => {
    console.log("User Service running on port 3001");
});