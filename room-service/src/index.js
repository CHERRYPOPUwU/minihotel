const express = require("express");
const app = express();

app.use(express.json());

let rooms = [];
let id = 1;

app.post("/rooms", (req, res) => {
    const room = {
        id: id++,
        number: req.body.number,
        price: req.body.price
    };
    rooms.push(room);
    res.json(room);
});

app.get("/rooms", (req, res) => {
    res.json(rooms);
});

app.listen(3002, () => {
    console.log("Room Service running on port 3002");
});