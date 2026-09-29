const express = require('express');
const app = express();

app.use(express.json());

// Data Resep Masakan
let recipes = [
  {
    id: 1,
    namaResep: "Nasi Goreng Kampung",
    asalDaerah: "Jawa Tengah",
    bahan: ["nasi", "bawang merah", "cabai"],
    waktuMasakMenit: 20,
    tingkatKesulitan: "mudah"
  },
  {
    id: 2,
    namaResep: "Rendang Daging",
    asalDaerah: "Sumatera Barat",
    bahan: ["daging sapi", "santan", "rempah"],
    waktuMasakMenit: 180,
    tingkatKesulitan: "sulit"
  }
];

// Route Utama Express
app.get('/', (req, res) => {
  res.json({
    message: "RESTful API Resep Masakan Berhasil Jalan!",
    identitas: {
      nama: "Sheila Aqrianggita Rolanda",
      nim: "2428240129"
    },
    endpoints: [
      "GET /api/recipes",
      "GET /api/recipes/:id"
    ]
  });
});

// Route Data Recipes
app.get('/recipes', (req, res) => {
  res.json(recipes);
});

app.get('/recipes/:id', (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe) return res.status(404).json({ message: "Resep tidak ditemukan" });
  res.json(recipe);
});


module.exports = app;