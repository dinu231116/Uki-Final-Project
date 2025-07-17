import dayjs from 'dayjs';
import AdminSettings from '../models/AdminSettings.js';





// 👉 GET: Today’s settings (NO fallback, NO dummy)
export const getSettings = async (req, res) => {
  try {
    const today = dayjs().format('YYYY-MM-DD');

    const settings = await AdminSettings.findOne({ date: today });

    if (!settings) {
      return res.status(404).json({ message: 'Today settings not found!' });
    }

    res.json(settings);
  } catch (err) {
    console.error('getSettings Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// 👉 POST: Update today’s settings (create if not exists)
export const updateSettings = async (req, res) => {
  try {
    const today = dayjs().format('YYYY-MM-DD');
    let settings = await AdminSettings.findOne({ date: today });

    const { openTime, closeTime, dailyCapacityKg } = req.body;

    if (!settings) {
      // Create new settings document if not exists
      settings = new AdminSettings({
        date: today,
        openTime,
        closeTime,
        dailyCapacityKg,
        remainingCapacityKg: dailyCapacityKg,
      });
    } else {
      // Calculate used capacity to keep remainingCapacityKg consistent
      const usedKg = settings.dailyCapacityKg - settings.remainingCapacityKg;

      settings.openTime = openTime;
      settings.closeTime = closeTime;
      settings.dailyCapacityKg = dailyCapacityKg;
      settings.remainingCapacityKg = Math.max(0, dailyCapacityKg - usedKg);
    }

    await settings.save();

    res.json({ message: 'Settings updated', settings });
  } catch (err) {
    console.error('updateSettings Error:', err);
    res.status(500).json({ message: err.message });
  }
};
