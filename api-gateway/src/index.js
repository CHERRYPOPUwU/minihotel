const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// 🔧 instancia axios con timeout
const api = axios.create({
  timeout: 5000
});

// ROOT (para probar que está vivo)
app.get("/", (req, res) => {
  res.send("API Gateway funcionando 🚀");
});

// USERS
app.post("/users", async (req, res) => {
  try {
    const response = await api.post("http://user-service:3001/users", req.body);
    res.status(201).json(response.data);
  } catch (error) {
    console.error("POST /users:", error.message);
    res.status(500).json({ error: "Error en user-service" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const response = await api.get("http://user-service:3001/users");
    res.json(response.data);
  } catch (error) {
    console.error("GET /users:", error.message);
    res.status(500).json({ error: "Error conectando con user-service" });
  }
});

// ROOMS
app.post("/rooms", async (req, res) => {
  try {
    const response = await api.post("http://room-service:3002/rooms", req.body);
    res.status(201).json(response.data);
  } catch (error) {
    console.error("POST /rooms:", error.message);
    res.status(500).json({ error: "Error en room-service" });
  }
});

app.get("/rooms", async (req, res) => {
  try {
    const response = await api.get("http://room-service:3002/rooms");
    res.json(response.data);
  } catch (error) {
    console.error("GET /rooms:", error.message);
    res.status(500).json({ error: "Error en room-service" });
  }
});

// BOOKINGS
app.post("/bookings", async (req, res) => {
  try {
    const response = await api.post("http://booking-service:3003/bookings", req.body);
    res.status(201).json(response.data);
  } catch (error) {
    console.error("POST /bookings:", error.message);
    res.status(500).json({ error: "Error en booking-service" });
  }
});

app.get("/bookings", async (req, res) => {
  try {
    const response = await api.get("http://booking-service:3003/bookings");
    res.json(response.data);
  } catch (error) {
    console.error("GET /bookings:", error.message);
    res.status(500).json({ error: "Error en booking-service" });
  }
});

app.listen(3000, () => {
  console.log("API Gateway running on port 3000");
});