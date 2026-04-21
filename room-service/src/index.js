const express = require("express");
const app = express();

app.use(express.json());

let rooms = [];
let id = 1;

app.post("/rooms", (req, res) => {
    const room = { id: id++, number: req.body.number, price: req.body.price };
    rooms.push(room);
    res.status(201).json(room);
});

app.get("/rooms", (req, res) => {
    res.json(rooms);
});

app.get("/rooms/:id", (req, res) => {
    const room = rooms.find(r => r.id === Number(req.params.id));
    if (!room) return res.status(404).json({ error: "Habitación no encontrada" });
    res.json(room);
});

app.put("/rooms/:id", (req, res) => {
    const idx = rooms.findIndex(r => r.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: "Habitación no encontrada" });
    rooms[idx] = { ...rooms[idx], number: req.body.number, price: req.body.price };
    res.json(rooms[idx]);
});

app.delete("/rooms/:id", (req, res) => {
  const idx = rooms.findIndex(r => r.id === Number(req.params.id));

  if (idx === -1) {
    return res.status(404).json({ error: "Habitación no encontrada" });
  }

  rooms.splice(idx, 1);

  res.status(200).json({ message: "Habitación eliminada correctamente" });
});

app.listen(3002, () => {
    console.log("Room Service running on port 3002");
});