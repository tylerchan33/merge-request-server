const router = require('express').Router();
const axios = require('axios')

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

router.get('/', async (req, res) => {
    try {
        const cities = req.query.usersCities
        const userCity = req.query.userCity

        const url = `https://fr.distance24.org/route.json?stops=${userCity}|${cities}`
        const response = await axios.get(url)
        res.json(response.data)
              
    } catch(err) {
        console.warn(err)
    }   
  
});

module.exports = router