const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const api = axios.create({ timeout: 5000 });

app.get("/", (req, res) => res.send("API Gateway running 🚀"));

/* ── USERS ── */
app.post("/users", async (req, res) => {
    try {
        const r = await api.post("http://user-service:3001/users", req.body);
        res.status(201).json(r.data);
    } catch (e) { res.status(500).json({ error: "Error en user-service" }); }
});

app.get("/users", async (req, res) => {
    try {
        const r = await api.get("http://user-service:3001/users");
        res.json(r.data);
    } catch (e) { res.status(500).json({ error: "Error en user-service" }); }
});

app.get("/users/:id", async (req, res) => {
    try {
        const r = await api.get(`http://user-service:3001/users/${req.params.id}`);
        res.json(r.data);
    } catch (e) { res.status(e.response?.status || 500).json(e.response?.data || { error: "Error en user-service" }); }
});

app.put("/users/:id", async (req, res) => {
    try {
        const r = await api.put(`http://user-service:3001/users/${req.params.id}`, req.body);
        res.json(r.data);
    } catch (e) { res.status(e.response?.status || 500).json(e.response?.data || { error: "Error en user-service" }); }
});

app.delete("/users/:id", async (req, res) => {
    try {
        await api.delete(`http://user-service:3001/users/${req.params.id}`);
        res.status(204).send();
    } catch (e) { res.status(e.response?.status || 500).json(e.response?.data || { error: "Error en user-service" }); }
});

/* ── ROOMS ── */
app.post("/rooms", async (req, res) => {
    try {
        const r = await api.post("http://room-service:3002/rooms", req.body);
        res.status(201).json(r.data);
    } catch (e) { res.status(500).json({ error: "Error en room-service" }); }
});

app.get("/rooms", async (req, res) => {
    try {
        const r = await api.get("http://room-service:3002/rooms");
        res.json(r.data);
    } catch (e) { res.status(500).json({ error: "Error en room-service" }); }
});

app.get("/rooms/:id", async (req, res) => {
    try {
        const r = await api.get(`http://room-service:3002/rooms/${req.params.id}`);
        res.json(r.data);
    } catch (e) { res.status(e.response?.status || 500).json(e.response?.data || { error: "Error en room-service" }); }
});

app.put("/rooms/:id", async (req, res) => {
    try {
        const r = await api.put(`http://room-service:3002/rooms/${req.params.id}`, req.body);
        res.json(r.data);
    } catch (e) { res.status(e.response?.status || 500).json(e.response?.data || { error: "Error en room-service" }); }
});

app.delete("/rooms/:id", async (req, res) => {
    try {
        await api.delete(`http://room-service:3002/rooms/${req.params.id}`);
        res.status(204).send();
    } catch (e) { res.status(e.response?.status || 500).json(e.response?.data || { error: "Error en room-service" }); }
});

/* ── BOOKINGS ── */
app.post("/bookings", async (req, res) => {
    try {
        const r = await api.post("http://booking-service:3003/bookings", req.body);
        res.status(201).json(r.data);
    } catch (e) { res.status(500).json({ error: "Error en booking-service" }); }
});

app.get("/bookings", async (req, res) => {
    try {
        const r = await api.get("http://booking-service:3003/bookings");
        res.json(r.data);
    } catch (e) { res.status(500).json({ error: "Error en booking-service" }); }
});

app.get("/bookings/:id", async (req, res) => {
    try {
        const r = await api.get(`http://booking-service:3003/bookings/${req.params.id}`);
        res.json(r.data);
    } catch (e) { res.status(e.response?.status || 500).json(e.response?.data || { error: "Error en booking-service" }); }
});

app.put("/bookings/:id", async (req, res) => {
    try {
        const r = await api.put(`http://booking-service:3003/bookings/${req.params.id}`, req.body);
        res.json(r.data);
    } catch (e) { res.status(e.response?.status || 500).json(e.response?.data || { error: "Error en booking-service" }); }
});

app.delete("/bookings/:id", async (req, res) => {
    try {
        await api.delete(`http://booking-service:3003/bookings/${req.params.id}`);
        res.status(204).send();
    } catch (e) { res.status(e.response?.status || 500).json(e.response?.data || { error: "Error en booking-service" }); }
});

app.listen(3000, () => console.log("API Gateway running on port 3000"));