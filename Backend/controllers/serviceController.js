import Service from '../models/serviceModel.js';

// ✅ Get all services from DB
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get single service by ID from DB
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Create new service (image field added)
export const createService = async (req, res) => {
  try {
    const { name, description, price, duration, details, image } = req.body;

    const newService = new Service({
      name,
      description,
      price,
      duration,
      details,
      image,  // Image URL save
    });

    const createdService = await newService.save();

    res.status(201).json(createdService);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update service by ID in DB (image field added)
export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service) {
      service.name = req.body.name || service.name;
      service.description = req.body.description || service.description;
      service.price = req.body.price || service.price;
      service.duration = req.body.duration || service.duration;
      service.details = req.body.details || service.details;
      service.image = req.body.image || service.image;  // Update image field

      const updatedService = await service.save();
      res.json(updatedService);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Delete service by ID in DB
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service) {
      await service.deleteOne();
      res.json({ message: 'Service deleted' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
