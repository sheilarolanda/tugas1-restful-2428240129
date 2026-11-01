const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  namaResep: { type: String, required: true },
  asalDaerah: { type: String, required: true },
  bahan: [{ type: String }],
  waktuMasakMenit: { type: Number, required: true },
  tingkatKesulitan: { type: String, required: true },
  kategoriId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Kategori', 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);