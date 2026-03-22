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
    res.json(booking);
});

app.get("/bookings", (req, res) => {
    res.json(bookings);
});

app.listen(3003, () => {
    console.log("Booking Service running on port 3003");
});