const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Data Awal Resep Masakan
let recipes = [
  {
    id: 1,
    namaResep: "Rendang Sapi",
    asalDaerah: "Padang",
    bahan: ["Daging Sapi", "Santan", "Bumbu Rendang", "Daun Jeruk"],
    waktuMasakMenit: 240,
    tingkatKesulitan: "sulit"
  },
  {
    id: 2,
    namaResep: "Nasi Goreng Kampung",
    asalDaerah: "Jawa",
    bahan: ["Nasi", "Bawang Merah", "Bawang Putih", "Telur", "Cabai"],
    waktuMasakMenit: 15,
    tingkatKesulitan: "mudah"
  },
  {
    id: 3,
    namaResep: "Soto Ayam",
    asalDaerah: "Lamongan",
    bahan: ["Ayam", "Kubis", "Tauge", "Koya", "Kuah Soto"],
    waktuMasakMenit: 60,
    tingkatKesulitan: "sedang"
  }
];

let nextId = 4;

app.get('/', (req, res) => {
  res.status(200).json({
    nama: "Sheila Aqrianggita Rolanda",
    nim: "2428240129",
    topik: "Topik 17 - Kuliner: Resep Masakan",
    endpoints: [
      "GET /recipes",
      "GET /recipes/:id",
      "GET /recipes?tingkatKesulitan=mudah",
      "POST /recipes",
      "PUT /recipes/:id",
      "DELETE /recipes/:id"
    ]
  });
});

app.get('/recipes', (req, res) => {
  const { tingkatKesulitan } = req.query;
  if (tingkatKesulitan) {
    const filtered = recipes.filter(
      (r) => r.tingkatKesulitan.toLowerCase() === tingkatKesulitan.toLowerCase()
    );
    return res.status(200).json(filtered);
  }
  res.status(200).json(recipes);
});

app.get('/recipes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const recipe = recipes.find((r) => r.id === id);
  if (!recipe) {
    return res.status(404).json({
      status: "error",
      message: `Resep dengan id ${id} tidak ditemukan`,
      data: null
    });
  }
  res.status(200).json(recipe);
});

app.post('/recipes', (req, res) => {
  const { namaResep, asalDaerah, bahan, waktuMasakMenit, tingkatKesulitan } = req.body;
  if (!namaResep || !bahan || !waktuMasakMenit || !tingkatKesulitan) {
    return res.status(400).json({
      status: "error",
      message: "Field namaResep, bahan, waktuMasakMenit, dan tingkatKesulitan wajib diisi",
      data: null
    });
  }
  const newRecipe = {
    id: nextId++,
    namaResep,
    asalDaerah: asalDaerah || "",
    bahan,
    waktuMasakMenit,
    tingkatKesulitan
  };
  recipes.push(newRecipe);
  res.status(201).json({
    status: "success",
    message: "Resep berhasil ditambahkan",
    data: newRecipe
  });
});

app.put('/recipes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const recipeIndex = recipes.findIndex((r) => r.id === id);
  if (recipeIndex === -1) {
    return res.status(404).json({
      status: "error",
      message: `Resep dengan id ${id} tidak ditemukan`,
      data: null
    });
  }
  const { namaResep, asalDaerah, bahan, waktuMasakMenit, tingkatKesulitan } = req.body;
  if (!namaResep || !bahan || !waktuMasakMenit || !tingkatKesulitan) {
    return res.status(400).json({
      status: "error",
      message: "Field namaResep, bahan, waktuMasakMenit, dan tingkatKesulitan wajib diisi",
      data: null
    });
  }
  recipes[recipeIndex] = {
    id,
    namaResep,
    asalDaerah: asalDaerah || "",
    bahan,
    waktuMasakMenit,
    tingkatKesulitan
  };
  res.status(200).json({
    status: "success",
    message: "Resep berhasil diperbarui",
    data: recipes[recipeIndex]
  });
});

app.delete('/recipes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const recipeIndex = recipes.findIndex((r) => r.id === id);
  if (recipeIndex === -1) {
    return res.status(404).json({
      status: "error",
      message: `Resep dengan id ${id} tidak ditemukan`,
      data: null
    });
  }
  recipes.splice(recipeIndex, 1);
  res.status(200).json({
    status: "success",
    message: `Resep dengan id ${id} berhasil dihapus`,
    data: null
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;