import express from 'express';
import Listing from '../models/Listing.js';

const router = express.Router();

// GET /api/locations/states - distinct states
router.get('/states', async (req, res) => {
  try {
    const states = await Listing.distinct('state');
    res.json(states);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/locations/cities?state=StateName - distinct cities within a state
router.get('/cities', async (req, res) => {
  const { state } = req.query;
  if (!state) {
    return res.status(400).json({ message: 'State query parameter required' });
  }
  try {
    const cities = await Listing.distinct('city', { state });
    res.json(cities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/locations/colleges?state=StateName&city=CityName - distinct colleges within state & city
router.get('/colleges', async (req, res) => {
  const { state, city } = req.query;
  if (!state || !city) {
    return res.status(400).json({ message: 'State and city query parameters required' });
  }
  try {
    const colleges = await Listing.distinct('college', { state, city });
    res.json(colleges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
