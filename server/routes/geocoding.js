const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');

const router = express.Router();
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

// Rate limiting
const rateLimiter = new Map();
const RATE_LIMIT = 50; // requests per minute
const RATE_WINDOW = 60000; // 1 minute

const checkRateLimit = (ip) => {
  const now = Date.now();
  const userRequests = rateLimiter.get(ip) || [];
  const recentRequests = userRequests.filter(time => now - time < RATE_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimiter.set(ip, recentRequests);
  return true;
};

router.get('/reverse', async (req, res) => {
  const { lat, lng } = req.query;
  
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude required' });
  }

  if (!checkRateLimit(req.ip)) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  const cacheKey = `${lat},${lng}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return res.json(cached);
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.status === 'OK') {
      const result = {
        address: response.data.results[0]?.formatted_address || 'Location not found',
        status: 'OK'
      };
      cache.set(cacheKey, result);
      res.json(result);
    } else {
      res.status(400).json({ error: 'Geocoding failed', status: response.data.status });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;