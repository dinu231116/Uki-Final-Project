import express from 'express';
const router = express.Router();

// Mock data (optional in-memory array)
let services = [
  { id: "1", name: "Wash & Fold", price: 5, duration: "2 days" },
  { id: "2", name: "Dry Cleaning", price: 10, duration: "3 days" },
  { id: "3", name: "Ironing", price: 3, duration: "1 day" }
];

// GET /api/pricing
router.get('/', (req, res) => {
  res.json({ services });
});

// POST /api/pricing
router.post('/', (req, res) => {
  const { name, price, duration } = req.body;

  if (!name || !price || !duration) {
    return res.status(400).json({ error: "Invalid data" });
  }

  const newService = {
    id: (services.length + 1).toString(),
    name,
    price,
    duration
  };

  services.push(newService);
  res.status(201).json({ message: "Service added successfully" });
});
// ✅ PUT update service price by ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { price } = req.body;

  const service = services.find(s => s.id === id);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }
  if (!price || isNaN(price)) {
    return res.status(400).json({ error: "Invalid price" });
  }

  service.price = price;
  res.status(200).json({ message: "Service updated" });
});
// ✅ DELETE /api/pricing/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const index = services.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Service not found" });
  }

  services.splice(index, 1); // remove from array
  res.status(200).json({ message: "Service removed successfully" });
});


export default router;
