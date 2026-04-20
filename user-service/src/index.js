const express = require("express");
const app = express();

app.use(express.json());

let users = [];
let id = 1;

app.post("/users", (req, res) => {
    const user = { id: id++, name: req.body.name };
    users.push(user);
    res.status(201).json(user);
});

app.get("/users", (req, res) => {
    res.json(users);
});

app.get("/users/:id", (req, res) => {
    const user = users.find(u => u.id === Number(req.params.id));
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
});

app.put("/users/:id", (req, res) => {
    const idx = users.findIndex(u => u.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: "Usuario no encontrado" });
    users[idx] = { ...users[idx], name: req.body.name };
    res.json(users[idx]);
});

app.delete("/users/:id", (req, res) => {
    const idx = users.findIndex(u => u.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: "Usuario no encontrado" });
    users.splice(idx, 1);
    res.status(204).send();
});

app.listen(3001, () => {
    console.log("User Service running on port 3001");
});