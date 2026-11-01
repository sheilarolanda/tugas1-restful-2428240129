const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const Kategori = require('../models/Kategori');

const app = express();
app.use(express.json());

// KONEKSI KE MONGODB
mongoose.connect('mongodb://127.0.0.1:27017/db_resep_masakan')
  .then(() => console.log('Terhubung ke MongoDB!'))
  .catch(err => console.error('Gagal koneksi MongoDB:', err));

// ==========================================
// 1. ENDPOINT KATEGORI (Target Referencing)
// ==========================================

// POST Tambah Kategori
app.post('/kategori', async (req, res) => {
  try {
    const kategori = await Kategori.create(req.body);
    res.status(201).json(kategori);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET Semua Kategori
app.get('/kategori', async (req, res) => {
  try {
    const kategori = await Kategori.find();
    res.status(200).json(kategori);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. ENDPOINT UTAMA RESEP (Fitur Lengkap)
// ==========================================

// POST Tambah Resep
app.post('/recipes', async (req, res) => {
  try {
    const resepBaru = await Recipe.create(req.body);
    res.status(201).json(resepBaru);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET Resep (Filtering, Sorting, Projection, Pagination, Referencing)
app.get('/recipes', async (req, res) => {
  try {
    const { asalDaerah, sort, fields, page = 1, limit = 10 } = req.query;

    // A. FILTERING
    let queryObj = {};
    if (asalDaerah) {
      queryObj.asalDaerah = { $regex: asalDaerah, $options: 'i' };
    }

    // B. REFERENCING / EMBEDDING (.populate)
    let query = Recipe.find(queryObj).populate('kategoriId', 'namaKategori deskripsi');

    // C. SORTING
    if (sort) {
      const sortBy = sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // D. PROJECTION
    if (fields) {
      const fieldList = fields.split(',').join(' ');
      query = query.select(fieldList);
    }

    // E. PAGINATION
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    query = query.skip(skip).limit(limitNum);

    // Eksekusi Query & Respon
    const data = await query;
    const total = await Recipe.countDocuments(queryObj);
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      data,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Jalankan Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});