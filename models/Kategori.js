const mongoose = require('mongoose');

const kategoriSchema = new mongoose.Schema({
  namaKategori: { type: String, required: true },
  deskripsi: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Kategori', kategoriSchema);