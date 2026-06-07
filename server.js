import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pickfit'
});

db.connect((err) => {
    if (err) {
        console.error('Gagal koneksi ke MySQL:', err);
        return;
    }
    console.log('Database PickFit Terhubung!');
});

// === ENDPOINT WARDROBE ===
app.get('/api/wardrobe', (req, res) => {
    const query = "SELECT * FROM wardrobe";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Gagal ambil data lemari:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// === ENDPOINT MIX & MATCH ===
app.post('/api/mixmatch', (req, res) => {
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

app.get('/api/mixmatch', (req, res) => {
    const query = "SELECT * FROM planner WHERE tanggal_rencana IS NULL ORDER BY id DESC";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// === ENDPOINT PLANNER ===
app.post('/api/planner', (req, res) => {
    const { idJepretan, tanggalRencana } = req.body;
    const query = "UPDATE planner SET tanggal_rencana = ? WHERE id = ?";
    
    db.query(query, [tanggalRencana, idJepretan], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Jadwal OOTD berhasil disimpan ke kalender!" });
    });
});

app.get('/api/planner', (req, res) => {
    const query = "SELECT * FROM planner WHERE tanggal_rencana IS NOT NULL ORDER BY id DESC";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.delete('/api/planner/:id', (req, res) => {
    const { id } = req.params;
    const query = "UPDATE planner SET tanggal_rencana = NULL WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Gagal membatalkan jadwal" });
        res.json({ message: "Jadwal berhasil dihapus!" });
    });
});

app.listen(3000, () => {
    console.log('Server Backend PickFit berjalan di http://localhost:3000');
});

// RUTE REGISTRASI USER BARU
app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Semua kolom wajib diisi!" });
    }

    // Cek apakah email sudah terdaftar
    db.query('SELECT email FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) return res.status(400).json({ message: "Email sudah terdaftar!" });

        // Simpan data user ke database
        const queryInsert = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(queryInsert, [name, email, password], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "Registrasi berhasil!" });
        });
    });
});

// RUTE LOGIN USER
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

        // Jika data cocok, kirimkan informasi user kembali ke frontend
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