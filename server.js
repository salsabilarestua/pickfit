import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import 'dotenv/config'; 
import path from 'path'; 
import { fileURLToPath } from 'url'; 

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

const express = require('express');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.static(path.join(__dirname, 'public'))); 

// KONEKSI DATABASE OTOMATIS: Kunci utama nembak addon Clever Cloud secara internal
const db = mysql.createConnection({
    host: process.env.MYSQL_ADDON_HOST || 'localhost',
    user: process.env.MYSQL_ADDON_USER || 'root',
    password: process.env.MYSQL_ADDON_PASSWORD || '',
    database: process.env.MYSQL_ADDON_DB || 'pickfit',
    port: process.env.MYSQL_ADDON_PORT || 3306
});

db.connect((err) => {
    if (err) {
        console.error('Gagal koneksi ke MySQL:', err);
        return;
    }
    console.log('Database PickFit Terhubung!');
});

// Jalankan port 8085 (Port wajib untuk trik .htaccess di server PHP)
const PORT = process.env.PORT || 8085;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Backend PickFit berjalan di port ${PORT}`);
});

// ==========================================
// === ENDPOINT WARDROBE (FIX SINKRON) ===
// ==========================================
app.get('/node-api/wardrobe', (req, res) => {
    const query = "SELECT * FROM wardrobe";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Gagal ambil data lemari:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.post('/node-api/wardrobe', (req, res) => {
    const { name, category, image_url } = req.body;
    if (!name || !image_url) {
        return res.status(400).json({ error: "Nama dan Gambar wajib diisi!" });
    }
    const user_id = 1; 
    const query = "INSERT INTO wardrobe (user_id, name, category, image_url) VALUES (?, ?, ?, ?)";
    db.query(query, [user_id, name, category || 'Atasan', image_url], (err, result) => {
        if (err) {
            console.error("Gagal menyimpan pakaian ke database:", err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "Berhasil disimpan!", id: result.insertId });
    });
});

app.delete('/node-api/wardrobe/:id', (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM wardrobe WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Gagal menghapus baju di DB Node:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Pakaian berhasil dihapus dari database!" });
    });
});

// ===========================================
// === ENDPOINT MIX & MATCH (SUDAH RAPI) ===
// ===========================================
app.post('/node-api/mixmatch', (req, res) => {
    const { preview_snapshot, nama_atasan, nama_bawahan, tanggal_jepret } = req.body;
    const query = "INSERT INTO planner (preview_snapshot, nama_atasan, nama_bawahan, tanggal_jepret, tanggal_rencana) VALUES (?, ?, ?, ?, NULL)";
    db.query(query, [preview_snapshot, nama_atasan, nama_bawahan, tanggal_jepret], (err, result) => {
        if (err) {
            console.error("Gagal menyimpan jepretan ke DB:", err);
            return res.status(500).json({ error: "Gagal menyimpan jepretan" });
        }
        res.status(201).json({ message: "Jepretan kombinasi sukses disimpan!", id: result.insertId });
    });
});

app.get('/node-api/mixmatch', (req, res) => {
    const query = "SELECT * FROM planner WHERE tanggal_rencana IS NULL ORDER BY id DESC";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ======================================
// === ENDPOINT PLANNER (SUDAH RAPI) ===
// ======================================
app.post('/node-api/planner', (req, res) => {
    const { idJepretan, tanggalRencana } = req.body;
    const query = "UPDATE planner SET tanggal_rencana = ? WHERE id = ?";
    db.query(query, [tanggalRencana, idJepretan], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Jadwal OOTD berhasil disimpan ke kalender!" });
    });
});

app.get('/node-api/planner', (req, res) => {
    const query = "SELECT * FROM planner WHERE tanggal_rencana IS NOT NULL ORDER BY id DESC";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.delete('/node-api/planner/:id', (req, res) => {
    const { id } = req.params;
    const query = "UPDATE planner SET tanggal_rencana = NULL WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Gagal membatalkan jadwal" });
        res.json({ message: "Jadwal berhasil dihapus!" });
    });
});

// === ENDPOINT MIX & MATCH ===
app.post('/node-api/mixmatch', (req, res) => { ... });{
    const { preview_snapshot, nama_atasan, nama_bawahan, tanggal_jepret } = req.body;
    const query = "INSERT INTO planner (preview_snapshot, nama_atasan, nama_bawahan, tanggal_jepret, tanggal_rencana) VALUES (?, ?, ?, ?, NULL)";
    
    db.query(query, [preview_snapshot, nama_atasan, nama_bawahan, tanggal_jepret], (err, result) => {
        if (err) {
            console.error("Gagal menyimpan jepretan ke DB:", err);
            return res.status(500).json({ error: "Gagal menyimpan jepretan" });
        }
        res.status(201).json({ message: "Jepretan kombinasi sukses disimpan!", id: result.insertId });
    });
});

app.get('/node-api/mixmatch', (req, res) => { ... }); {
    const query = "SELECT * FROM planner WHERE tanggal_rencana IS NULL ORDER BY id DESC";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// === ENDPOINT PLANNER ===
app.post('/node-api/planner', (req, res) => { ... }); {
    const { idJepretan, tanggalRencana } = req.body;
    const query = "UPDATE planner SET tanggal_rencana = ? WHERE id = ?";
    
    db.query(query, [tanggalRencana, idJepretan], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Jadwal OOTD berhasil disimpan ke kalender!" });
    });
});

app.get('/node-api/planner', (req, res) => { ... }); {
    const query = "SELECT * FROM planner WHERE tanggal_rencana IS NOT NULL ORDER BY id DESC";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.delete(('/node-api/planner/:id', (req, res) => { ... }); {
    const { id } = req.params;
    const query = "UPDATE planner SET tanggal_rencana = NULL WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Gagal membatalkan jadwal" });
        res.json({ message: "Jadwal berhasil dihapus!" });
    });
});

// === RUTE REGISTRASI USER BARU ===
app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Semua kolom wajib diisi!" });
    }

    db.query('SELECT email FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) return res.status(400).json({ message: "Email sudah terdaftar!" });

        const queryInsert = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(queryInsert, [name, email, password], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "Registrasi berhasil!" });
        });
    });
});

// === RUTE LOGIN USER ===
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email dan password wajib diisi!" });
    }

    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(401).json({ message: "Email atau password salah!" });
        }

        const user = results[0];
        res.status(200).json({
            message: "Login sukses!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    });
});

app.delete('/node-api/koleksi/:id', (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM planner WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Sukses dihapus" });
    });
});