const express = require("express");
const app = express();

app.use(express.json());

let bookings = [];
let id = 1;

app.post("/bookings", (req, res) => {
    const booking = {
        id: id++,
        userId: req.body.userId,
        roomId: req.body.roomId,
        date: req.body.date
    };
    bookings.push(booking);
    res.status(201).json(booking);
});

app.get("/bookings", (req, res) => {
    res.json(bookings);
});

app.get("/bookings/:id", (req, res) => {
    const booking = bookings.find(b => b.id === Number(req.params.id));
    if (!booking) return res.status(404).json({ error: "Reserva no encontrada" });
    res.json(booking);
});

app.put("/bookings/:id", (req, res) => {
    const idx = bookings.findIndex(b => b.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: "Reserva no encontrada" });
    bookings[idx] = {
        ...bookings[idx],
        userId: req.body.userId,
        roomId: req.body.roomId,
        date: req.body.date
    };
    res.json(bookings[idx]);
});

app.delete("/bookings/:id", (req, res) => {
    const idx = bookings.findIndex(b => b.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: "Reserva no encontrada" });
    bookings.splice(idx, 1);
    res.status(204).send();
});

app.listen(3003, () => {
    console.log("Booking Service running on port 3003");
});