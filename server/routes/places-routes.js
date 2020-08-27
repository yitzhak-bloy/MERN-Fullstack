const express = require('express');

const placesControllers = require('../controllers/place-controller')

const router = express.Router();

router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlaceByUserId);

router.post('/', placesControllers.createPlace);

router.patch('/:pid', placesControllers.updatePlace)


module.exports = router;
