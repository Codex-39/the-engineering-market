import express from 'express';
import { STATES, CITIES, getCollegesList } from '../constants/indiaLocations.js';

const router = express.Router();

// GET /api/locations/states
router.get('/states', (req, res) => {
  try {
    res.json(STATES);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/locations/cities?state=StateName
router.get('/cities', (req, res) => {
  const { state } = req.query;
  if (!state) {
    return res.status(400).json({ message: 'State query parameter required' });
  }
  try {
    const cities = CITIES[state] || [];
    res.json(cities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/locations/colleges?state=StateName&city=CityName
router.get('/colleges', (req, res) => {
  const { state, city } = req.query;
  if (!state || !city) {
    return res.status(400).json({ message: 'State and city query parameters required' });
  }
  try {
    const colleges = getCollegesList(state, city);
    res.json(colleges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;

