const { showProfile, updateProfile} = require('../controllers/profileController');

const router = require('express').Router();

router.get('/profile',showProfile);
router.post('/profile',updateProfile);

module.exports = router;