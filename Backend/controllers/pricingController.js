// Example laundry services data (replace with DB later)
const services = [
  { id: '1', name: 'Wash & Fold', price: 5, duration: '2 days' },
  { id: '2', name: 'Dry Cleaning', price: 10, duration: '3 days' },
  { id: '3', name: 'Ironing', price: 3, duration: '1 day' }
];

export const getPricing = (req, res) => {
  if (services.length === 0) {
    return res.status(404).json({ error: 'No services found' });
  }
  res.status(200).json({ services });
};

export const addService = (req, res) => {
  const { name, price, duration } = req.body;
  if (!name || !price || !duration) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const newService = {
    id: (services.length + 1).toString(),
    name,
    price,
    duration
  };
  services.push(newService);
  res.status(201).json({ message: "Service added successfully", service: newService });
};