import express from 'express';
import dayjs from 'dayjs';
import AdminSettings from '../models/AdminSettings.js';
import { getSettings, updateSettings } from '../controllers/adminSettingsController.js';
const router = express.Router();

// 👉 Get base settings (single)
router.get('/single', async (req, res) => {
  try {
    const settings = await AdminSettings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 👉 Update base settings
router.post('/update', async (req, res) => {
  const { openTime, closeTime, dailyCapacityKg } = req.body;

  try {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      // If no settings found, create new
      settings = new AdminSettings({ openTime, closeTime, dailyCapacityKg });
    } else {
      settings.openTime = openTime;
      settings.closeTime = closeTime;
      settings.dailyCapacityKg = dailyCapacityKg;
    }
    await settings.save();
    res.json({ message: 'Settings updated', settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 👉 Get today settings
router.get('/', async (req, res) => {
  try {
    const today = dayjs().format('YYYY-MM-DD');

    let settings = await AdminSettings.findOne({ date: today });

    // If not exist for today, create new copy or fallback
    if (!settings) {
      const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
      const prev = await AdminSettings.findOne({ date: yesterday });

      if (prev) {
        settings = new AdminSettings({
          openTime: prev.openTime,
          closeTime: prev.closeTime,
          dailyCapacityKg: prev.dailyCapacityKg,
          remainingCapacityKg: prev.dailyCapacityKg,
          date: today
        });
      } else {
        settings = new AdminSettings({
          openTime: '08:00 AM',
          closeTime: '08:00 PM',
          dailyCapacityKg: 100,
          remainingCapacityKg: 100,
          date: today
        });
      }

      await settings.save();
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// 👉 Update today settings
router.put('/', async (req, res) => {
  try {
    const today = dayjs().format('YYYY-MM-DD');
    let settings = await AdminSettings.findOne({ date: today });

    if (!settings) {
      return res.status(404).json({ msg: 'Settings not found for today!' });
    }

    const { openTime, closeTime, dailyCapacityKg } = req.body;

    if (openTime) settings.openTime = openTime;
    if (closeTime) settings.closeTime = closeTime;

    if (dailyCapacityKg && dailyCapacityKg > 0) {
      const usedCapacity = settings.dailyCapacityKg - settings.remainingCapacityKg;
      settings.dailyCapacityKg = dailyCapacityKg;
      settings.remainingCapacityKg = Math.max(0, dailyCapacityKg - usedCapacity);
    }

    await settings.save();

    res.json(settings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
router.get('/today', getSettings);
router.post('/today', updateSettings);

export default router;
