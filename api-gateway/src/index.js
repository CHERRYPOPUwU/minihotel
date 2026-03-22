const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// USERS
app.post("/users", async (req, res) => {
    const response = await axios.post("http://user-service:3001/users", req.body);
    res.json(response.data);
});

app.get("/users", async (req, res) => {
    const response = await axios.get("http://user-service:3001/users");
    res.json(response.data);
});

// ROOMS
app.post("/rooms", async (req, res) => {
    const response = await axios.post("http://room-service:3002/rooms", req.body);
    res.json(response.data);
});

app.get("/rooms", async (req, res) => {
    const response = await axios.get("http://room-service:3002/rooms");
    res.json(response.data);
});

// BOOKINGS
app.post("/bookings", async (req, res) => {
    const response = await axios.post("http://booking-service:3003/bookings", req.body);
    res.json(response.data);
});

app.get("/bookings", async (req, res) => {
    const response = await axios.get("http://booking-service:3003/bookings");
    res.json(response.data);
});

app.listen(3000, () => {
    console.log("API Gateway running on port 3000");
});